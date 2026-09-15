function toggleMenu(){
    const nav = document.querySelector('header nav');

    if(!nav) return;

    nav.classList.toggle('mobile-open');
}

document.addEventListener('DOMContentLoaded', function(){

    const nav = document.querySelector('header nav');

    if(!nav) return;

    const links = nav.querySelectorAll('a');

    links.forEach(function(link){
        link.addEventListener('click', function(){
            nav.classList.remove('mobile-open');
        });
    });

});



const monthNames=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
let calendarDate=new Date();
calendarDate.setDate(1);
let selectedDate=null;

function pad(n){return String(n).padStart(2,'0');}
function formatDate(date){
  return `${pad(date.getDate())}/${pad(date.getMonth()+1)}/${date.getFullYear()}`;
}
function isSameDay(a,b){return a&&b&&a.toDateString()===b.toDateString();}
function renderCalendar(){
  const calendar=document.getElementById('calendar');
  if(!calendar) return;
  const month=document.getElementById('calendarMonth');
  const year=document.getElementById('calendarYear');
  month.textContent=monthNames[calendarDate.getMonth()].charAt(0).toUpperCase()+monthNames[calendarDate.getMonth()].slice(1);
  year.textContent=calendarDate.getFullYear();
  calendar.innerHTML='';
  const firstDay=new Date(calendarDate.getFullYear(),calendarDate.getMonth(),1).getDay();
  const offset=(firstDay+6)%7;
  const days=new Date(calendarDate.getFullYear(),calendarDate.getMonth()+1,0).getDate();
  const today=new Date(); today.setHours(0,0,0,0);
  for(let i=0;i<offset;i++){const empty=document.createElement('button');empty.className='day empty';empty.tabIndex=-1;calendar.appendChild(empty);}
  for(let d=1;d<=days;d++){
    const date=new Date(calendarDate.getFullYear(),calendarDate.getMonth(),d);
    const btn=document.createElement('button');btn.type='button';btn.className='day';btn.textContent=d;
    if(date<today){btn.classList.add('past');btn.disabled=true;}
    if(isSameDay(date,today))btn.classList.add('today');
    if(isSameDay(date,selectedDate))btn.classList.add('selected');
    btn.addEventListener('click',()=>selectDate(date));
    calendar.appendChild(btn);
  }
}
function selectDate(date){
  selectedDate=new Date(date);
  document.getElementById('selectedDate').textContent=formatDate(selectedDate);
  renderCalendar();
}
function requestAppointment(){
  const status=document.getElementById('appointmentStatus');
  const name=document.getElementById('patientName').value.trim();
  const phone=document.getElementById('patientPhone').value.trim();
  const time=document.getElementById('appointmentTime').value;
  const service=document.getElementById('appointmentService').value;
  
  const message=document.getElementById('patientMessage').value.trim();

  if(!selectedDate||!time||!name||!phone){
    status.className='appointment-status error';
    status.textContent='Por favor selecciona fecha, horario, nombre y celular.';
    return;
  }

  const request={
    id:Date.now(),
    date:formatDate(selectedDate),
    time,
    name,
    phone,
    service,
    message,
    status:'Pendiente'
  };

  /*
    WhatsApp de recepción de citas de Oral Dent.
    El mensaje se construye con saltos de línea reales y encodeURIComponent()
    para que llegue ordenado, incluso si contiene tildes, ñ o caracteres especiales.
  */
  const whatsappNumber='51981760638';

 const whatsappMessage = `
ORAL DENT — SOLICITUD DE CITA
Dr. Segundo Roberto Guadalupe Chirinos

DATOS DEL PACIENTE
Nombre: ${request.name}
WhatsApp: ${request.phone}

DATOS DE LA CITA
Fecha solicitada: ${request.date}
Horario preferido: ${request.time}
Motivo / servicio: ${request.service}

DESCRIPCIÓN DEL SERVICIO
${request.message || 'No se proporcionó una descripción.'}

Solicitud enviada desde la página web de Oral Dent.
Quedo atento(a) a la confirmación de disponibilidad.
`;

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  status.className='appointment-status';
  status.innerHTML=
    'Solicitud lista.<br>' +
    'Se abrirá WhatsApp con la información de la cita <strong>ordenada y lista para enviar</strong>.';

  window.open(whatsappUrl,'_blank');
}
document.addEventListener('DOMContentLoaded',()=>{
  renderCalendar();
  document.getElementById('prevMonth')?.addEventListener('click',()=>{calendarDate.setMonth(calendarDate.getMonth()-1);renderCalendar();});
  document.getElementById('nextMonth')?.addEventListener('click',()=>{calendarDate.setMonth(calendarDate.getMonth()+1);renderCalendar();});
  document.getElementById('requestAppointment')?.addEventListener('click',requestAppointment);
});

/* V3.8.2 - Presentación: pista única con voz natural + música de fondo sincronizadas */
let presentation = {state:'idle'};

function updatePresentationButton(){
  const btn = document.getElementById('presentationTrigger');
  if(!btn) return;
  if(presentation.state === 'playing'){
    btn.textContent = '⏸ Presentación';
    btn.classList.add('presentation-playing');
    btn.setAttribute('aria-label','Pausar presentación del consultorio');
  }else if(presentation.state === 'paused'){
    btn.textContent = '▶ Presentación';
    btn.classList.remove('presentation-playing');
    btn.setAttribute('aria-label','Continuar presentación del consultorio');
  }else{
    btn.textContent = '▶ Presentación del consultorio';
    btn.classList.remove('presentation-playing');
    btn.setAttribute('aria-label','Reproducir presentación del consultorio');
  }
}

function getPresentationAudio(){
  return document.getElementById('presentationAudio');
}

function finishPresentation(){
  const audio = getPresentationAudio();
  if(audio){
    audio.pause();
    audio.currentTime = 0;
  }
  presentation.state = 'idle';
  updatePresentationButton();
}

async function startPresentation(){
  const audio = getPresentationAudio();
  if(!audio) return;
  audio.currentTime = 0;
  presentation.state = 'playing';
  updatePresentationButton();
  try{
    await audio.play();
  }catch(err){
    finishPresentation();
  }
}

function pausePresentation(){
  const audio = getPresentationAudio();
  if(!audio) return;
  if(presentation.state === 'playing'){
    audio.pause();
    presentation.state = 'paused';
  }else if(presentation.state === 'paused'){
    audio.play().catch(()=>{});
    presentation.state = 'playing';
  }
  updatePresentationButton();
}

function togglePresentation(){
  if(presentation.state === 'idle') startPresentation();
  else pausePresentation();
}

document.addEventListener('DOMContentLoaded',()=>{
  const trigger = document.getElementById('presentationTrigger');
  const nav = document.getElementById('presentationNav');
  const audio = getPresentationAudio();

  if(audio){
    audio.addEventListener('ended', finishPresentation);
    audio.addEventListener('error', finishPresentation);
  }

  trigger?.addEventListener('click', togglePresentation);
  
  nav?.addEventListener('click',(e)=>{
  e.preventDefault();
  togglePresentation();
});
  
  updatePresentationButton();


  updatePresentationButton();
});

/* V3.9 - Navegación por secciones independientes */
document.addEventListener('DOMContentLoaded', () => {

    const main = document.querySelector('main#inicio');
    if (!main) return;

    const sections = Array.from(main.querySelectorAll(':scope > section'));

    function mostrarSeccion(id) {
        const destino = document.getElementById(id);

        if (id === 'inicio') {
            sections.forEach(section => {
                section.style.display = section.classList.contains('hero') ? '' : 'none';
            });

            window.scrollTo(0, 0);
            return;
        }

        if (!destino || !sections.includes(destino)) return;

        sections.forEach(section => {
            section.style.display = section === destino ? '' : 'none';
        });

        window.scrollTo(0, 0);
    }

    const enlaces = document.querySelectorAll('header a[href^="#"], main a[href^="#"], .float[href^="#"]');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', (e) => {

            const destino = enlace.getAttribute('href');

            if (!destino || destino === '#') return;

            const id = destino.substring(1);

            if (!document.getElementById(id)) return;

            e.preventDefault();

            mostrarSeccion(id);

            if (id !== 'inicio') {
                history.pushState(null, '', destino);
            } else {
                history.pushState(null, '', window.location.pathname);
            }
        });
    });

    window.addEventListener('popstate', () => {
        const id = window.location.hash
            ? window.location.hash.substring(1)
            : 'inicio';

        mostrarSeccion(id);
    });

    const seccionInicial = window.location.hash
        ? window.location.hash.substring(1)
        : 'inicio';

    mostrarSeccion(seccionInicial);
});