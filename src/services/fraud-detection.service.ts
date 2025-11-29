// ChefIApp™ - Fraud Detection Service
// Handles task completion analysis, check-in verification, and risk scoring

import { supabase } from '../lib/supabase';
import {
    TaskMetadata,
    CheckInMetadata,
    UserRiskScore,
    FraudFlag
} from '../lib/employee-relationship-types';

// ============================================================================
// TASK COMPLETION ANALYSIS
// ============================================================================

export async function analyzeTaskCompletion(data: {
    task_id: string;
    user_id: string;
    started_at: number;
    completed_at: number;
    expected_duration_minutes: number;
    gps_coordinates?: { latitude: number; longitude: number };
    company_location?: { latitude: number; longitude: number };
    photo_url?: string;
}): Promise<TaskMetadata> {
    const {
        task_id,
        user_id,
        started_at,
        completed_at,
        expected_duration_minutes,
        gps_coordinates,
        company_location,
        photo_url
    } = data;

    const duration_minutes = (completed_at - started_at) / 60000;
    const speed_ratio = expected_duration_minutes > 0
        ? duration_minutes / expected_duration_minutes
        : 1;

    const fraud_flags: FraudFlag[] = [];

    // 1. Timing Analysis
    if (speed_ratio < 0.3) {
        fraud_flags.push({
            code: 'TOO_FAST',
            type: 'timing',
            description: 'Task completed significantly faster than expected',
            severity: 'medium',
            detected_at: new Date().toISOString(),
            auto_detected: true
        });
    }

    const hour = new Date(completed_at).getHours();
    const unusual_time = hour >= 2 && hour <= 5;
    if (unusual_time) {
        fraud_flags.push({
            code: 'UNUSUAL_TIME',
            type: 'timing',
            description: 'Task completed at unusual hour (2AM-5AM)',
            severity: 'low',
            detected_at: new Date().toISOString(),
            auto_detected: true
        });
    }

    // 2. Location Analysis
    let distance = 0;
    let gps_spoofing = false;

    if (gps_coordinates && company_location) {
        distance = calculateDistance(
            gps_coordinates.latitude,
            gps_coordinates.longitude,
            company_location.latitude,
            company_location.longitude
        );

        if (distance > 1000) { // > 1km
            fraud_flags.push({
                code: 'FAR_LOCATION',
                type: 'location',
                description: 'Task completed far from company location',
                severity: 'high',
                detected_at: new Date().toISOString(),
                auto_detected: true
            });
        }
    }

    // 3. Save Metadata
    const metadata: Partial<TaskMetadata> = {
        task_id,
        user_id,
        expected_duration_minutes,
        actual_duration_minutes: Math.round(duration_minutes),
        completion_speed_ratio: Number(speed_ratio.toFixed(2)),
        completed_at_unusual_time: unusual_time,
        gps_coordinates,
        distance_from_company_meters: Number(distance.toFixed(2)),
        gps_spoofing_detected: gps_spoofing,
        photo_url,
        fraud_flags,
        is_outlier: fraud_flags.length > 0
    };

    const { data: savedMetadata, error } = await supabase
        .from('task_metadata')
        .insert(metadata)
        .select()
        .single();

    if (error) throw error;

    // 4. Update Risk Score
    if (fraud_flags.length > 0) {
        await updateUserRiskScore(user_id, fraud_flags);
    }

    return savedMetadata as TaskMetadata;
}

// ============================================================================
// CHECK-IN ANALYSIS
// ============================================================================

export async function analyzeCheckIn(data: {
    check_in_id?: string;
    user_id: string;
    company_id: string;
    gps_coordinates: { latitude: number; longitude: number };
    company_location: { latitude: number; longitude: number };
    device_info: any;
}): Promise<CheckInMetadata> {
    const {
        check_in_id,
        user_id,
        company_id,
        gps_coordinates,
        company_location,
        device_info
    } = data;

    const fraud_flags: FraudFlag[] = [];

    // 1. Location Analysis
    const distance = calculateDistance(
        gps_coordinates.latitude,
        gps_coordinates.longitude,
        company_location.latitude,
        company_location.longitude
    );

    if (distance > 200) { // > 200m
        fraud_flags.push({
            code: 'FAR_CHECK_IN',
            type: 'location',
            description: 'Check-in too far from company',
            severity: 'high',
            detected_at: new Date().toISOString(),
            auto_detected: true
        });
    }

    // 2. Save Metadata
    const metadata: Partial<CheckInMetadata> = {
        check_in_id,
        user_id,
        company_id,
        gps_coordinates,
        distance_from_company_meters: Number(distance.toFixed(2)),
        location_verified: distance <= 200,
        device_info,
        fraud_flags,
        is_outlier: fraud_flags.length > 0
    };

    const { data: savedMetadata, error } = await supabase
        .from('check_in_metadata')
        .insert(metadata)
        .select()
        .single();

    if (error) throw error;

    // 3. Update Risk Score
    if (fraud_flags.length > 0) {
        await updateUserRiskScore(user_id, fraud_flags, company_id);
    }

    return savedMetadata as CheckInMetadata;
}

// ============================================================================
// RISK SCORING
// ============================================================================

async function updateUserRiskScore(
    user_id: string,
    new_flags: FraudFlag[],
    company_id?: string
) {
    // If company_id is not provided, we might need to look it up or update global score
    // For now, we'll assume company_id is needed or we skip
    if (!company_id) return;

    const { data: currentScore } = await supabase
        .from('user_risk_score')
        .select('*')
        .eq('user_id', user_id)
        .eq('company_id', company_id)
        .single();

    let overall_risk = currentScore?.overall_risk_score || 0;
    let total_flags = currentScore?.total_fraud_flags || 0;

    // Simple additive risk model
    for (const flag of new_flags) {
        total_flags++;
        if (flag.severity === 'high') overall_risk += 20;
        else if (flag.severity === 'medium') overall_risk += 10;
        else overall_risk += 5;
    }

    overall_risk = Math.min(100, overall_risk);

    let trust_level = 'trusted';
    if (overall_risk >= 75) trust_level = 'review_required';
    else if (overall_risk >= 50) trust_level = 'suspicious';
    else if (overall_risk >= 25) trust_level = 'monitor';

    const updateData = {
        user_id,
        company_id,
        overall_risk_score: overall_risk,
        total_fraud_flags: total_flags,
        trust_level,
        recent_flags: new_flags, // In real app, append to history
        requires_manual_review: overall_risk >= 75
    };

    if (currentScore) {
        await supabase
            .from('user_risk_score')
            .update(updateData)
            .eq('id', currentScore.id);
    } else {
        await supabase
            .from('user_risk_score')
            .insert(updateData);
    }
}

// ============================================================================
// HELPERS
// ============================================================================

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
