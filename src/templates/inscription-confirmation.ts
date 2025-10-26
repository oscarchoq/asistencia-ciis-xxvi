/**
 * Template de confirmación de inscripción mejorado con QR
 * Placeholders:
 * {{name}} - Nombre completo del usuario
 * {{qrImage}} - QR en base64 (data URL)
 */

export const inscriptionConfirmationTemplate = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmación de Inscripción - CIIS XXVI</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f6f8;
      color: #333;
      line-height: 1.6;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
    }

    .header {
      background: linear-gradient(135deg, #000126 0%, #1a2a6c 100%);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }

    .header h1 {
      font-size: 24px;
      margin-bottom: 8px;
      font-weight: 600;
      color: #ffffff;
    }

    .header p {
      font-size: 14px;
      opacity: 0.9;
      color: #ffffff;
    }

    .content {
      padding: 40px 30px;
    }

    .greeting {
      font-size: 16px;
      color: #1e3c72;
      margin-bottom: 20px;
    }

    .greeting strong {
      font-weight: 600;
    }

    .section {
      margin-bottom: 30px;
    }

    .section h2 {
      font-size: 16px;
      color: #1e3c72;
      margin-bottom: 12px;
      font-weight: 600;
      border-bottom: 2px solid #2a5298;
      padding-bottom: 8px;
    }

    .section p {
      font-size: 14px;
      color: #555;
      margin-bottom: 8px;
      line-height: 1.8;
    }

    .qr-section {
      background: #f9f9f9;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 30px 0;
    }

    .qr-section h3 {
      font-size: 14px;
      color: #1e3c72;
      margin-bottom: 15px;
      font-weight: 600;
    }

    .qr-image {
      display: inline-block;
      padding: 10px;
      background: white;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .qr-image img {
      display: block;
      width: 200px;
      height: 200px;
      margin: 0 auto;
    }

    .qr-text {
      font-size: 12px;
      color: #666;
      margin-top: 10px;
      font-style: italic;
    }

    .info-box {
      background: #f0f4ff;
      border-left: 4px solid #2a5298;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }

    .info-box strong {
      color: #1e3c72;
    }

    .links {
      margin-top: 20px;
      font-size: 14px;
      color: #444;
    }

    .links a {
      color: #2a5298;
      text-decoration: none;
      font-weight: 500;
    }

    .links a:hover {
      text-decoration: underline;
    }

    .footer {
      background: #f1f1f1;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #e0e0e0;
    }

    .footer a {
      color: #1e3c72;
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }

    .divider {
      height: 1px;
      background: #e0e0e0;
      margin: 20px 0;
    }

    .highlight {
      background: #fff3cd;
      padding: 12px;
      border-radius: 4px;
      margin: 15px 0;
      border-left: 4px solid #ffc107;
    }

    .button {
      display: inline-block;
      background: #2a5298;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      margin-top: 15px;
      transition: background 0.3s;
    }

    .button:hover {
      background: #1e3c72;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Encabezado -->
    <div class="header">
      <h1>¡Confirmación de tu Inscripción!</h1>
      <p>Congreso Internacional de Informática y Sistemas XXVI</p>
    </div>

    <!-- Contenido Principal -->
    <div class="content">
      <div class="greeting">
        Hola <strong>{{name}}</strong> 👋
      </div>

      <p>
        Nos alegra informarte que tu inscripción al 
        <strong>Congreso Internacional de Informática y Sistemas XXVI</strong> 
        ha sido <strong>confirmada exitosamente</strong>.
      </p>

      <!-- Sección de QR -->
      <div class="qr-section">
        <h3>Tu Código de Identificación (QR)</h3>
        <div class="qr-image">
          <img src="{{qrImage}}" alt="Código QR de identificación" />
        </div>
        <p class="qr-text">Guarda este código QR. Lo necesitarás en el evento.</p>
      </div>

      <!-- Información Importante -->
      <div class="section">
        <h2>📋 Información de tu Inscripción</h2>
        <p>
          1. Guarda tu QR, te enviamos el QR como un archivo adjunto.<br />
          2. Revisa tu correo para actualizaciones importantes<br />
          3. Verifica la información del evento en nuestro sitio web<br />
          4. Presenta tu QR al momento de ingreso al evento
        </p>
      </div>

      <!-- Aviso Importante -->
      <div class="highlight">
        <strong>⚠️ Importante:</strong> Este es tu código de acceso único. No lo compartas con otras personas.
      </div>

      <!-- Enlaces -->
      <div class="links">
        <p>Para más información, visita nuestros canales oficiales:</p>
        🌐 Sitio web: <a href="https://ciistacna.com" target="_blank">ciistacna.com</a><br />
        📘 Facebook: <a href="https://www.facebook.com/ciistacna" target="_blank">facebook.com/ciistacna</a>
      </div>

      <div class="divider"></div>

      <p style="font-size: 13px; color: #666; margin-top: 20px;">
        Si tienes alguna consulta o problema con tu inscripción, no dudes en escribirnos a 
        <strong><a href="mailto:ciistacna@unjbg.edu.pe" style="color: #2a5298;">ciistacna@unjbg.edu.pe</a></strong>
      </p>
    </div>

    <!-- Pie -->
    <div class="footer">
      <p>© 2025 CIIS XXVI Tacna. Todos los derechos reservados.</p>
      <p style="margin-top: 8px;">
        Este correo ha sido generado automáticamente. Por favor, no respondas a este mensaje.
      </p>
    </div>
  </div>
</body>
</html>
`;
