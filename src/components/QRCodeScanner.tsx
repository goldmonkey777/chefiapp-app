// ChefIApp™ - QR Code Scanner Component
// Scanner de QR Code para funcionários entrarem na empresa

import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface QRCodeScannerProps {
    onScanSuccess: (companyId: string) => void;
    onClose: () => void;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScanSuccess, onClose }) => {
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            stopScanning();
        };
    }, []);

    const startScanning = async () => {
        try {
            setError(null);
            setScanning(true);

            // Request camera permission
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop()); // Stop immediately, just checking permission
            setCameraPermission('granted');

            // Initialize scanner
            const scanner = new Html5Qrcode('qr-reader');
            scannerRef.current = scanner;

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
            };

            await scanner.start(
                { facingMode: 'environment' }, // Use back camera
                config,
                async (decodedText) => {
                    console.log('QR Code detected:', decodedText);

                    // Stop scanning
                    await stopScanning();

                    // Validate and process QR code
                    await processQRCode(decodedText);
                },
                (errorMessage) => {
                    // Ignore scanning errors (happens continuously while scanning)
                    // console.log('Scan error:', errorMessage);
                }
            );
        } catch (err: any) {
            console.error('Error starting scanner:', err);

            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setCameraPermission('denied');
                setError('Permissão de câmera negada. Por favor, permita o acesso à câmera nas configurações.');
            } else if (err.name === 'NotFoundError') {
                setError('Nenhuma câmera encontrada no dispositivo.');
            } else {
                setError('Erro ao iniciar câmera. Tente novamente.');
            }

            setScanning(false);
        }
    };

    const stopScanning = async () => {
        try {
            if (scannerRef.current && scannerRef.current.isScanning) {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            }
        } catch (err) {
            console.error('Error stopping scanner:', err);
        }
        setScanning(false);
    };

    const processQRCode = async (qrData: string) => {
        try {
            // QR code format: com-chefiapp-app://company/{companyId}
            // or just the company ID

            let companyId = qrData;

            // Extract company ID from URL format
            if (qrData.includes('com-chefiapp-app://company/')) {
                companyId = qrData.split('com-chefiapp-app://company/')[1];
            } else if (qrData.includes('company/')) {
                companyId = qrData.split('company/')[1];
            }

            // Validate company exists
            const { data: company, error: companyError } = await supabase
                .from('companies')
                .select('id, name')
                .eq('id', companyId)
                .single();

            if (companyError || !company) {
                setError('QR Code inválido. Empresa não encontrada.');
                return;
            }

            // Success!
            setSuccess(true);
            setTimeout(() => {
                onScanSuccess(company.id);
            }, 1500);
        } catch (err: any) {
            console.error('Error processing QR code:', err);
            setError('Erro ao processar QR code. Tente novamente.');
        }
    };

    const handleManualInput = () => {
        setError(null);
        setShowManualInput(true);
    };

    const handleManualSubmit = async () => {
        if (!manualCode.trim()) {
            setError('Por favor, digite o código da empresa.');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            await processQRCode(manualCode.trim());
        } catch (err) {
            setError('Erro ao processar código. Tente novamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleManualCancel = () => {
        setShowManualInput(false);
        setManualCode('');
        setError(null);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Escanear QR Code</h2>
                            <p className="text-sm text-blue-100">Escaneie o código da empresa</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Scanner Area */}
                <div className="p-6 space-y-4">
                    {/* QR Reader Container */}
                    <div className="relative bg-black rounded-xl overflow-hidden" style={{ minHeight: '300px' }}>
                        <div id="qr-reader" className="w-full" />

                        {/* Overlay when not scanning */}
                        {!scanning && !success && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <div className="text-center text-white p-6">
                                    <Camera className="w-16 h-16 mx-auto mb-4 text-white/70" />
                                    <p className="text-lg font-semibold mb-2">Pronto para escanear</p>
                                    <p className="text-sm text-white/70">Clique em "Iniciar Scanner" abaixo</p>
                                </div>
                            </div>
                        )}

                        {/* Success Overlay */}
                        {success && (
                            <div className="absolute inset-0 flex items-center justify-center bg-green-500/90">
                                <div className="text-center text-white p-6">
                                    <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                                    <p className="text-lg font-semibold">QR Code válido!</p>
                                    <p className="text-sm">Entrando na empresa...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-red-200">{error}</p>
                                {cameraPermission === 'denied' && (
                                    <p className="text-xs text-red-300 mt-2">
                                        Vá em Configurações → Privacidade → Câmera e permita o acesso
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    {!error && !success && (
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="text-sm text-white font-medium mb-2">Como usar:</p>
                            <ol className="text-sm text-blue-100 space-y-1 list-decimal list-inside">
                                <li>Clique em "Iniciar Scanner"</li>
                                <li>Permita o acesso à câmera</li>
                                <li>Aponte para o QR Code da empresa</li>
                                <li>Aguarde a leitura automática</li>
                            </ol>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                        {!scanning && !success && (
                            <button
                                onClick={startScanning}
                                className="w-full bg-white text-blue-600 font-bold py-4 rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2"
                            >
                                <Camera className="w-5 h-5" />
                                Iniciar Scanner
                            </button>
                        )}

                        {scanning && (
                            <button
                                onClick={stopScanning}
                                className="w-full bg-red-500 text-white font-bold py-4 rounded-xl hover:bg-red-600 transition"
                            >
                                Parar Scanner
                            </button>
                        )}

                        {/* Manual Input Option */}
                        {!showManualInput && (
                            <button
                                onClick={handleManualInput}
                                className="w-full bg-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition text-sm"
                            >
                                Ou digite o código manualmente
                            </button>
                        )}
                    </div>

                    {/* Manual Input Modal */}
                    {showManualInput && (
                        <div className="bg-white/10 rounded-xl p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Código da Empresa
                                </label>
                                <input
                                    type="text"
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
                                    placeholder="Digite o código ou ID da empresa"
                                    className="w-full px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-white/50 focus:border-white focus:outline-none"
                                    autoFocus
                                    disabled={isProcessing}
                                />
                                <p className="text-xs text-blue-100 mt-2">
                                    Exemplo: 123e4567-e89b-12d3-a456-426614174000
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleManualCancel}
                                    className="flex-1 bg-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition"
                                    disabled={isProcessing}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleManualSubmit}
                                    className="flex-1 bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isProcessing || !manualCode.trim()}
                                >
                                    {isProcessing ? 'Verificando...' : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QRCodeScanner;
