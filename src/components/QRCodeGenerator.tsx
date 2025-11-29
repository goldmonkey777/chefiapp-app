// ChefIApp™ - QR Code Generator Component
// Gerador e exibição de QR Code da empresa

import React, { useState, useRef } from 'react';
import { QrCode, Download, Share2, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCompany } from '../hooks/useCompany';

interface QRCodeGeneratorProps {
  userId: string;
  size?: number;
  showActions?: boolean;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  userId,
  size = 256,
  showActions = true,
}) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const { company, generateQRCode } = useCompany(userId);

  const qrCodeData = generateQRCode();

  if (!company || !qrCodeData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Nenhuma empresa configurada</p>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    try {
      // Get the SVG element
      const svg = qrRef.current?.querySelector('svg');
      if (!svg) return;

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size (larger for better quality)
      const scale = 4;
      canvas.width = (size + 32) * scale;
      canvas.height = (size + 32) * scale;

      // Fill white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Convert SVG to image
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Draw image centered with padding
        const padding = 16 * scale;
        ctx.drawImage(img, padding, padding, size * scale, size * scale);

        // Convert to PNG and download
        canvas.toBlob((blob) => {
          if (!blob) return;
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${company.name}-qrcode.png`;
          link.click();
          URL.revokeObjectURL(url);
        }, 'image/png');
      };

      img.src = url;
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${company.name} - ChefIApp`,
          text: `Entre na equipe ${company.name} usando este QR Code`,
          url: qrCodeData,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          QR Code da Empresa
        </h2>
        <p className="text-gray-600">
          Compartilhe este código com novos funcionários
        </p>
      </div>

      {/* Company Info */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 mb-6 text-center border-2 border-blue-200">
        <h3 className="font-bold text-lg text-gray-900">{company.name}</h3>
        <p className="text-sm text-gray-600 capitalize">
          {company.type.replace('_', ' ')}
        </p>
      </div>

      {/* QR Code */}
      <div className="mb-6" ref={qrRef}>
        <div
          className="bg-white p-4 rounded-2xl border-4 border-gray-900 mx-auto"
          style={{ width: size + 32, height: size + 32 }}
        >
          <QRCodeSVG
            value={qrCodeData}
            size={size}
            level="H"
            includeMargin={false}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
          Como usar:
        </h4>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Peça ao funcionário para abrir o ChefIApp</li>
          <li>Na tela de login, selecionar "Escanear QR Code"</li>
          <li>Escanear este código</li>
          <li>O funcionário será automaticamente adicionado!</li>
        </ol>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleCopy}
            className="flex flex-col items-center gap-2 p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5 text-gray-700" />
            )}
            <span className="text-xs font-medium text-gray-700">
              {copied ? 'Copiado!' : 'Copiar'}
            </span>
          </button>

          <button
            onClick={handleDownload}
            className="flex flex-col items-center gap-2 p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <Download className="w-5 h-5 text-gray-700" />
            <span className="text-xs font-medium text-gray-700">Baixar</span>
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-2 p-4 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors"
          >
            <Share2 className="w-5 h-5 text-blue-700" />
            <span className="text-xs font-medium text-blue-700">
              Compartilhar
            </span>
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {company.totalEmployees}
            </div>
            <div className="text-xs text-gray-500">Funcionários</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {company.activeEmployees}
            </div>
            <div className="text-xs text-gray-500">Ativos Agora</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
