export const inscriptionEmailTemplate = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Confirmación de Registro - CIIS</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(90deg, #000126, #1a2a6c); color: #ffffff; text-align: center; padding: 20px; }
    .header h1 { margin: 0; font-size: 22px; }
    .content { padding: 30px; color: #333333; line-height: 1.6; }
    .content h2 { margin-top: 0; color: #1e3c72; }
    .links { margin-top: 20px; font-size: 14px; color: #444444; }
    .links a { color: #2a5298; text-decoration: none; }
    .footer { background: #f1f1f1; text-align: center; font-size: 12px; color: #666666; padding: 15px; }
    .footer a { color: #1e3c72; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Encabezado -->
    <div class="header">
      <h1>¡Gracias por tu registro!</h1>
    </div>

    <!-- Contenido -->
    <div class="content">
      <h2>Hola, {{name}} 👋</h2>
      <p>
        Nos alegra informarte que hemos recibido tu registro en el
        <b>Congreso Internacional de Informática y Sistemas XXVI</b>.
      </p>
      <p>
        En este momento tu inscripción se encuentra en proceso de
        <b>verificación de pago</b>. Una vez que nuestro equipo confirme tu
        transacción, recibirás un correo de confirmación final.
      </p>
      <p>
        Mientras tanto, te invitamos a visitar nuestros canales oficiales para estar al tanto de todas las novedades:
      </p>

      <div class="links">
        🌐 Sitio web: <a href="https://ciistacna.com" target="_blank">ciistacna.com</a><br>
        📘 Facebook: <a href="https://www.facebook.com/ciistacna" target="_blank">facebook.com/ciistacna</a>
      </div>
    </div>

    <!-- Pie -->
    <div class="footer">
      Si tienes alguna consulta, escríbenos a 
      <a href="mailto:ciistacna@unjbg.edu.pe">ciistacna@unjbg.edu.pe</a>.
      <br />
      © 2025 CIIS Tacna. Todos los derechos reservados.
    </div>
  </div>
</body>
</html>
`