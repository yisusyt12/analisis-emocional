/* =======================
  Lógica JS para auth
   - Guarda usuarios en localStorage: key "users" (array de objetos {name,email,password})
   - Al login genera token (localStorage.key "token") y redirige a checklist.html
   - Si hay token activo en carga, redirige automáticamente
   - Validaciones simples
   ======================= */

/* --- Helpers --- */
function getUsers(){
  try {
    const raw = localStorage.getItem('users');
    return raw ? JSON.parse(raw) : [];
  } catch (e){
    console.error("Error parse users", e);
    return [];
  }
}
function saveUsers(users){
  localStorage.setItem('users', JSON.stringify(users));
}
function randomToken(len=32){
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let t='';
  for(let i=0;i<len;i++) t += chars[Math.floor(Math.random()*chars.length)];
  return t;
}
function showMessage(type, text){
  const area = document.getElementById('messageArea');
  area.innerHTML = `<div class="alert ${type}">${text}</div>`;
  // opcional: ocultar después de 5s
  setTimeout(()=>{ if(area.innerHTML.includes(text)) area.innerHTML = ''; }, 7000);
}

/* --- Redirección si ya hay token --- */
(function checkTokenOnLoad(){
  const token = localStorage.getItem('token');
  if(token){
    // usuario ya logueado -> redirigir al checklist
    // ajusta la ruta según tu proyecto (ej: '/checklist.html' o '/app/checklist.html')
    window.location.href = '../formulario/formulario.html';
  }
})();

/* --- Toggle forms --- */
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formTitle = document.getElementById('formTitle');
const formSubtitle = document.getElementById('formSubtitle');

document.getElementById('showRegister').addEventListener('click', function(e){
  e.preventDefault();
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
  formTitle.textContent = 'Crear cuenta';
  formSubtitle.textContent = 'Regístrate para guardar tu progreso y acceder al checklist.';
  document.getElementById('messageArea').innerHTML = '';
});
document.getElementById('showLogin').addEventListener('click', function(e){
  e.preventDefault();
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
  formTitle.textContent = 'Iniciar sesión';
  formSubtitle.textContent = 'Bienvenido — ingresa tu cuenta para continuar con el checklist.';
  document.getElementById('messageArea').innerHTML = '';
});

/* --- Registro --- */
registerForm.addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;

  // validaciones simples
  if(!name || !email || !password){
    showMessage('error','Por favor completa todos los campos.');
    return;
  }
  if(!/^\S+@\S+\.\S+$/.test(email)){
    showMessage('error','Ingresa un email válido.');
    return;
  }
  if(password.length < 6){
    showMessage('error','La contraseña debe tener al menos 6 caracteres.');
    return;
  }

  const users = getUsers();
  if(users.some(u => u.email === email)){
    showMessage('error','Ya existe una cuenta con ese email. Usa otro o inicia sesión.');
    return;
  }

  // Guardar usuario (nota: en producción no guardar contraseñas en claro)
  users.push({ name, email, password });
  saveUsers(users);

  showMessage('success','Cuenta creada correctamente. Ahora puedes iniciar sesión.');
  // cambiar a login automáticamente
  setTimeout(()=> {
    registerForm.reset();
    document.getElementById('showLogin').click();
  }, 900);
});

/* --- Login --- */
loginForm.addEventListener('submit', function(e){
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  if(!email || !password){
    showMessage('error','Completa el email y la contraseña.');
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if(!user){
    showMessage('error','Credenciales incorrectas. Verifica tu email y contraseña.');
    return;
  }

  // Generar token y guardar
  const token = randomToken(40);
  localStorage.setItem('token', token);

  // Puedes guardar info mínima del usuario si la necesitas
  localStorage.setItem('user', JSON.stringify({name: user.name, email: user.email}));

  showMessage('success','Inicio de sesión correcto. Redirigiendo...');

  // Redirigir al checklist (ajusta ruta según tu proyecto)
  setTimeout(()=> {
    window.location.href = '../formulario/formulario.html';
  }, 900);
});

/* --- Para desarrollo: muestra en consola usuarios y token (opcional) --- */
window._auth_debug = {
  getUsers, saveUsers
};