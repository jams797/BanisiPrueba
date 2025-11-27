require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));

// Puerto de ejecució
const PORT = process.env.PORT || 5200;

// Health Checker
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


// Importar rutas
const authRoutes = require("./src/modules/security/auth/user_routes");
const loanApplicationRoutes = require("./src/modules/loan_application/loan_application_routes");


// Rutas
app.use('/auth', authRoutes);
app.use('/loanApplication', loanApplicationRoutes);


// Ejemplo de endpoint GET
app.get('/api/saludo', (req, res) => {
  const nombre = req.query.nombre || 'mundo';
  res.json({ mensaje: `Hola, ${nombre}!` });
});

// Ejemplo de endpoint POST
app.post('/api/usuarios', (req, res) => {
  const { nombre, correo } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ error: 'nombre y correo son requeridos' });
  }

  // Aquí iría la lógica para guardar en BD
  // por ahora simulamos
  const usuarioCreado = {
    id: Date.now(),
    nombre,
    correo
  };

  res.status(201).json(usuarioCreado);
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
