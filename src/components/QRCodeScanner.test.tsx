import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QRCodeScanner } from './QRCodeScanner';
import { supabase } from '../lib/supabase';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn(),
                })),
            })),
        })),
    },
}));

// Mock Html5Qrcode
vi.mock('html5-qrcode', () => {
    return {
        Html5Qrcode: vi.fn().mockImplementation(() => ({
            start: vi.fn(),
            stop: vi.fn(),
            clear: vi.fn(),
            isScanning: false,
        })),
    };
});

// Mock navigator.mediaDevices
Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
        getUserMedia: vi.fn().mockResolvedValue({
            getTracks: () => [{ stop: vi.fn() }],
        }),
    },
});

describe('QRCodeScanner', () => {
    const mockOnScanSuccess = vi.fn();
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<QRCodeScanner onScanSuccess={mockOnScanSuccess} onClose={mockOnClose} />);
        expect(screen.getByText('Escanear QR Code')).toBeInTheDocument();
        expect(screen.getByText('Ou digite o código manualmente')).toBeInTheDocument();
    });

    it('opens manual input modal when clicking the button', () => {
        render(<QRCodeScanner onScanSuccess={mockOnScanSuccess} onClose={mockOnClose} />);

        const manualButton = screen.getByText('Ou digite o código manualmente');
        fireEvent.click(manualButton);

        expect(screen.getByText('Código da Empresa')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Digite o código ou ID da empresa')).toBeInTheDocument();
    });

    it('validates empty manual code', async () => {
        render(<QRCodeScanner onScanSuccess={mockOnScanSuccess} onClose={mockOnClose} />);

        fireEvent.click(screen.getByText('Ou digite o código manualmente'));

        const confirmButton = screen.getByText('Confirmar');
        // Button should be disabled initially or when empty
        expect(confirmButton).toBeDisabled();

        // Try to force click if it wasn't disabled (it is in the code, but good to check logic)
        // In the code: disabled={isProcessing || !manualCode.trim()}
    });

    it('processes valid manual code successfully', async () => {
        const mockCompany = { id: '123-456', name: 'Test Company' };

        // Setup Supabase mock for success
        const singleMock = vi.fn().mockResolvedValue({ data: mockCompany, error: null });
        const eqMock = vi.fn().mockReturnValue({ single: singleMock });
        const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
        const fromMock = vi.fn().mockReturnValue({ select: selectMock });

        // @ts-ignore
        supabase.from.mockImplementation(fromMock);

        render(<QRCodeScanner onScanSuccess={mockOnScanSuccess} onClose={mockOnClose} />);

        // Open manual input
        fireEvent.click(screen.getByText('Ou digite o código manualmente'));

        // Type code
        const input = screen.getByPlaceholderText('Digite o código ou ID da empresa');
        fireEvent.change(input, { target: { value: '123-456' } });

        // Submit
        const confirmButton = screen.getByText('Confirmar');
        expect(confirmButton).not.toBeDisabled();
        fireEvent.click(confirmButton);

        // Verify Supabase call
        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('companies');
            expect(selectMock).toHaveBeenCalledWith('id, name');
            expect(eqMock).toHaveBeenCalledWith('id', '123-456');
        });

        // Verify success callback
        await waitFor(() => {
            expect(mockOnScanSuccess).toHaveBeenCalledWith('123-456');
        }, { timeout: 2000 }); // Wait for the 1500ms timeout in the component
    });

    it('handles invalid manual code', async () => {
        // Setup Supabase mock for failure
        const singleMock = vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } });
        const eqMock = vi.fn().mockReturnValue({ single: singleMock });
        const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
        const fromMock = vi.fn().mockReturnValue({ select: selectMock });

        // @ts-ignore
        supabase.from.mockImplementation(fromMock);

        render(<QRCodeScanner onScanSuccess={mockOnScanSuccess} onClose={mockOnClose} />);

        fireEvent.click(screen.getByText('Ou digite o código manualmente'));

        const input = screen.getByPlaceholderText('Digite o código ou ID da empresa');
        fireEvent.change(input, { target: { value: 'invalid-code' } });

        fireEvent.click(screen.getByText('Confirmar'));

        await waitFor(() => {
            expect(screen.getByText('QR Code inválido. Empresa não encontrada.')).toBeInTheDocument();
        });

        expect(mockOnScanSuccess).not.toHaveBeenCalled();
    });
});
