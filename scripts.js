document.addEventListener("DOMContentLoaded", () => {
    // Variables globales
    const citas = JSON.parse(localStorage.getItem("citas")) || [];
    let ingresosTotales = citas.reduce((total, cita) => total + cita.costo, 0);
    let citasPorDia = {};

    // Organizar citas por día
    citas.forEach(({ fecha, hora, costo }) => {
        if (!citasPorDia[fecha]) {
            citasPorDia[fecha] = [];
        }
        citasPorDia[fecha].push({ hora, costo });
    });

    // Elementos del DOM
    const citasCount = document.getElementById("citas-count");
    const ingresosTotal = document.getElementById("ingresos-total");
    const calendarGrid = document.getElementById("calendar-grid");
    const modalCita = document.getElementById("modal-cita");
    const btnAgregarCita = document.getElementById("btn-agregar-cita");
    const closeModal = document.getElementById("close-modal");
    const saveCita = document.getElementById("save-cita");
    const citaFecha = document.getElementById("cita-fecha");
    const citaHora = document.getElementById("cita-hora");
    const citaCosto = document.getElementById("cita-costo");
    const modalMes = document.getElementById("modalMes");
    const closeModalMes = document.getElementById("closeModalMes");
    const modalCitasDia = document.getElementById("modalCitasDia");
    const citasDiaList = document.getElementById("citas-dia-list");
    const closeCitasDia = document.getElementById("close-citas-dia");
    const eliminarCitasBtn = document.getElementById("btn-eliminar-todas");
    const btnRegresar = document.getElementById("btn-regresar");

    // Chatbot
    const chatbotBubble = document.getElementById("chatbot-bubble");
    const chatbotWindow = document.getElementById("chatbot-window");
    const messages = document.getElementById("messages");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Acciones del menú
    const dashboardLink = document.getElementById("dashboard-link");
    const calendarLink = document.getElementById("calendar-link");

    dashboardLink.addEventListener("click", () => {
        document.getElementById("dashboard").classList.remove("hidden");
        document.getElementById("calendar").classList.add("hidden");
        chatbotWindow.classList.add("hidden");
    });

    calendarLink.addEventListener("click", () => {
        document.getElementById("calendar").classList.remove("hidden");
        document.getElementById("dashboard").classList.add("hidden");
        chatbotWindow.classList.add("hidden");
    });

    // Mostrar/ocultar chatbot
    if (chatbotBubble) {
        chatbotBubble.addEventListener("click", () => {
            chatbotWindow.classList.toggle("hidden");
        });
    }

    // Agregar cita
    if (btnAgregarCita) {
        btnAgregarCita.addEventListener("click", () => {
            modalCita.classList.remove("hidden");
        });
    }

    if (closeModal) {
        closeModal.addEventListener("click", () => {
            modalCita.classList.add("hidden");
        });
    }

    if (saveCita) {
        saveCita.addEventListener("click", (event) => {
            event.preventDefault(); // Prevenir comportamiento por defecto
            const fecha = citaFecha.value;
            const hora = citaHora.value;
            const costo = parseFloat(citaCosto.value);

            if (fecha && hora && !isNaN(costo)) {
                citas.push({ fecha, hora, costo });
                ingresosTotales += costo;

                if (!citasPorDia[fecha]) {
                    citasPorDia[fecha] = [];
                }
                citasPorDia[fecha].push({ hora, costo });

                localStorage.setItem("citas", JSON.stringify(citas));
                actualizarDashboard();
                actualizarCalendario();
                modalCita.classList.add("hidden");

                citaFecha.value = "";
                citaHora.value = "";
                citaCosto.value = "";
            } else {
                alert("Por favor completa todos los campos correctamente.");
            }
        });
    }

    // Actualizar el dashboard
    function actualizarDashboard() {
        citasCount.textContent = citas.length;
        ingresosTotal.textContent = `Q${ingresosTotales.toFixed(2)}`;
    }

    // Actualizar el calendario
    function actualizarCalendario() {
        calendarGrid.innerHTML = "";
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        for (let i = 0; i < 12; i++) {
            const monthDiv = document.createElement("div");
            monthDiv.classList.add("month-box");
            monthDiv.textContent = monthNames[i];

            monthDiv.addEventListener("click", () => {
                mostrarDiasDelMes(i);
            });

            calendarGrid.appendChild(monthDiv);
        }
    }

    // Mostrar días del mes
    function mostrarDiasDelMes(monthIndex) {
        modalMes.classList.remove("hidden");
        const today = new Date();
        const year = today.getFullYear();
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const monthGrid = document.getElementById("month-grid");

        // Establecer título del mes
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        document.getElementById("modal-title").textContent = monthNames[monthIndex];

        monthGrid.innerHTML = "";

        for (let day = 1; day <= daysInMonth; day++) {
            const dia = new Date(year, monthIndex, day);
            const diaStr = dia.toISOString().split("T")[0];

            const dayDiv = document.createElement("div");
            dayDiv.classList.add("day-box");
            dayDiv.textContent = day;

            if (citasPorDia[diaStr]) {
                dayDiv.classList.add("has-citas");
                dayDiv.innerHTML += '<span style="color: red;"> ❌</span>'; // X roja
            }

            dayDiv.addEventListener("click", () => {
                if (citasPorDia[diaStr]) {
                    mostrarCitasDelDia(diaStr);
                }
            });

            monthGrid.appendChild(dayDiv);
        }
    }

    // Regresar a la vista anterior
    btnRegresar.addEventListener("click", () => {
        modalMes.classList.add("hidden");
    });

    // Mostrar citas del día
    function mostrarCitasDelDia(fecha) {
        const citasDelDia = citasPorDia[fecha];
        citasDiaList.innerHTML = "";

        citasDelDia.forEach((cita) => {
            const li = document.createElement("li");
            li.textContent = `${cita.hora} - Costo: Q${cita.costo.toFixed(2)}`;
            citasDiaList.appendChild(li);
        });

        modalCitasDia.classList.remove("hidden");
    }

    if (closeCitasDia) {
        closeCitasDia.addEventListener("click", () => {
            modalCitasDia.classList.add("hidden");
        });
    }

    if (closeModalMes) {
        closeModalMes.addEventListener("click", () => {
            modalMes.classList.add("hidden");
        });
    }

    // Eliminar todas las citas
    if (eliminarCitasBtn) {
        eliminarCitasBtn.addEventListener("click", () => {
            if (confirm("¿Estás seguro de que deseas eliminar todas las citas?")) {
                citas.length = 0;
                citasPorDia = {};
                ingresosTotales = 0;

                localStorage.removeItem("citas");
                actualizarDashboard();
                actualizarCalendario();
            }
        });
    }

    actualizarDashboard();
    actualizarCalendario();



    document.getElementById("btn-imprimir").addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        // Establecer fuente y tamaño
        pdf.setFontSize(20);
        
        // Encabezado centrado
        const header = "ESTUDIO MB";
        const headerWidth = pdf.getStringUnitWidth(header) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const headerX = (pdf.internal.pageSize.width - headerWidth) / 2; // Centramos
        pdf.text(header, headerX, 10);
        
        // Información general (centrado y en negrita)
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold"); // Poner en negrita
        const totalCitasText = `Total de Citas: ${citas.length}`;
        const ingresosTotalesText = `Ingresos Totales: Q${ingresosTotales.toFixed(2)}`;
        const totalCitasX = (pdf.internal.pageSize.width - pdf.getStringUnitWidth(totalCitasText) * pdf.internal.getFontSize() / pdf.internal.scaleFactor) / 2;
        const ingresosTotalesX = (pdf.internal.pageSize.width - pdf.getStringUnitWidth(ingresosTotalesText) * pdf.internal.getFontSize() / pdf.internal.scaleFactor) / 2;
        
        pdf.text(totalCitasText, totalCitasX, 30);
        pdf.text(ingresosTotalesText, ingresosTotalesX, 40);
    
        // Crear tabla para citas
        const startY = 50; // Ajustamos el inicio para que los encabezados estén directamente arriba de la tabla
        const tableWidth = pdf.internal.pageSize.width - 20;
        const columnWidth = tableWidth / 4;
        
        // Títulos de la tabla (centrados)
        pdf.setTextColor(255, 255, 255); // Color de texto blanco para los encabezados
    
        // Definir el color de fondo de los encabezados
        const headerColorLight = [144, 238, 144]; // Verde menta claro
        const headerColorDark = [60, 179, 113]; // Verde menta más oscuro
        
        // Dibujar las celdas de encabezado con el color de fondo
        const headerXStart = 10;
        const headerY = startY;
        const headerHeight = 10;
        
        // Celda de "Cita #"
        pdf.setFillColor(...headerColorLight);
        pdf.rect(headerXStart, headerY, columnWidth, headerHeight, 'F');
        // Celda de "Fecha"
        pdf.setFillColor(...headerColorDark);
        pdf.rect(headerXStart + columnWidth, headerY, columnWidth, headerHeight, 'F');
        // Celda de "Hora"
        pdf.setFillColor(...headerColorLight);
        pdf.rect(headerXStart + 2 * columnWidth, headerY, columnWidth, headerHeight, 'F');
        // Celda de "Costo"
        pdf.setFillColor(...headerColorDark);
        pdf.rect(headerXStart + 3 * columnWidth, headerY, columnWidth, headerHeight, 'F');
        
        // Títulos de la tabla (centrados)
        pdf.setFontSize(10); // Ajustamos el tamaño de la fuente para los encabezados
        pdf.setTextColor(0, 0, 0); // Color negro para los textos
        pdf.text("Cita #", headerXStart + columnWidth / 2, headerY + 6, { align: "center" });
        pdf.text("Fecha", headerXStart + columnWidth * 1.5, headerY + 6, { align: "center" });
        pdf.text("Hora", headerXStart + columnWidth * 2.5, headerY + 6, { align: "center" });
        pdf.text("Costo", headerXStart + columnWidth * 3.5, headerY + 6, { align: "center" });
        
        // Dibujar las celdas de la tabla y mostrar los datos
        let currentY = headerY + headerHeight; // Ahora los datos empiezan justo después del encabezado
        let totalCosto = 0; // Variable para acumular el costo total
        citas.forEach((cita, index) => {
            currentY += 10;
            
            // Dibujar bordes de las celdas
            pdf.rect(10, currentY, columnWidth, 10); // Cita #
            pdf.rect(columnWidth + 10, currentY, columnWidth, 10); // Fecha
            pdf.rect(columnWidth * 2 + 10, currentY, columnWidth, 10); // Hora
            pdf.rect(columnWidth * 3 + 10, currentY, columnWidth, 10); // Costo
            
            // Llenar las celdas con datos
            pdf.text(`${index + 1}`, 10 + columnWidth / 2, currentY + 6, { align: "center" });
            pdf.text(`${cita.fecha}`, columnWidth + 10 + columnWidth / 2, currentY + 6, { align: "center" });
            pdf.text(`${cita.hora}`, columnWidth * 2 + 10 + columnWidth / 2, currentY + 6, { align: "center" });
            pdf.text(`Q${cita.costo.toFixed(2)}`, columnWidth * 3 + 10 + columnWidth / 2, currentY + 6, { align: "center" });
    
            // Acumulamos el costo
            totalCosto += cita.costo;
        });
    
        // Mostrar el total generado debajo de la tabla
        currentY += 15; // Espacio después de la tabla
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold"); // Poner en negrita
        pdf.text(`Total Generado Q${totalCosto.toFixed(2)}`, 10 + columnWidth / 2, currentY, { align: "center" });
    
        // Pie de página centrado
        const footer = "Desarrollado por J. Donis";
        const footerWidth = pdf.getStringUnitWidth(footer) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const footerX = (pdf.internal.pageSize.width - footerWidth) / 2; // Centramos
        pdf.text(footer, footerX, pdf.internal.pageSize.height - 10);
    
        // Guardar PDF
        pdf.save("dashboard.pdf");
    });
    

   // Funciones de chatbot
function enviarMensajeDeBienvenida() {
    agregarMensaje("Chatbot", "¡Hola! Bienvenido a Estudio MB 💅✨. Soy tu asistente virtual y estoy aquí para ayudarte.");
    setTimeout(() => {
        agregarMensaje("Chatbot", "¿En qué puedo ayudarte hoy?\n1️⃣ Consultar servicios y precios.\n2️⃣ Agendar una cita.\n3️⃣ Información sobre pagos.\n4️⃣ Otras consultas.");
    }, 1000);
}

enviarMensajeDeBienvenida();

if (sendBtn) {
    sendBtn.addEventListener("click", () => {
        const userMessage = userInput.value;
        if (userMessage.trim()) {
            agregarMensaje("Usuario", userMessage);
            userInput.value = "";
            responderChatbot(userMessage);
        }
    });
}

function agregarMensaje(remitente, mensaje) {
    const messageElement = document.createElement("div");
    messageElement.className = `mensaje ${remitente.toLowerCase()}`;
    messageElement.textContent = `${remitente}: ${mensaje}`;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
}

function responderChatbot(mensaje) {
    const lowerMessage = mensaje.toLowerCase();
    let respuesta;

    if (lowerMessage.includes("hola") || lowerMessage.includes("buenos días") || lowerMessage.includes("buenas tardes") || lowerMessage.includes("buenas noches")) {
        respuesta = "¡Hola! 😊 Qué gusto saludarte. ¿Cómo estás hoy? ¿Hay algo específico en lo que te pueda ayudar o tal vez quieras saber más sobre nuestros servicios?";
    } else if (lowerMessage.includes("cómo estás") || lowerMessage.includes("cómo te va")) {
        respuesta = "¡Gracias por preguntar! Estoy aquí, listo para ayudarte en todo lo que necesites. ¿Qué tal tú? ¿Cómo va tu día?";
    } else if (lowerMessage.includes("servicios") || lowerMessage.includes("precios")) {
        respuesta = "¡Por supuesto! Estos son algunos de los servicios que ofrecemos en Estudio MB:\n\nUñas acrílicas: Q150.\nBaño de acrílico: Q130.\nGel semipermanente: Q80.\nRetoque: Q100.\nRetiro de acrílico: Q50.\nRetiro de gel: Q10.\n\n¿Te gustaría que te explique algún servicio en detalle o tal vez quieras saber cuánto tiempo toma cada uno? 😊";
    } else if (lowerMessage.includes("agendar") || lowerMessage.includes("cita")) {
        respuesta = "¡Claro que sí! Agendar una cita es muy fácil. Solo necesito que me compartas algunos datos:\n- Tu nombre completo.\n- La fecha y hora en la que te gustaría agendar.\n- El o los servicios que deseas realizar.\n\nUna vez que tenga esta información, puedo verificar la disponibilidad y confirmarte la cita. ¿Te gustaría que lo hagamos ahora mismo?";
    } else if (lowerMessage.includes("pagos") || lowerMessage.includes("métodos")) {
        respuesta = "Aceptamos varios métodos de pago para tu comodidad:\n💳 Transferencia bancaria: Te proporcionaremos los datos al momento de confirmar tu cita.\n💵 Efectivo: Puedes pagar directamente al finalizar tu servicio.\n\nSi tienes alguna duda sobre cómo realizar el pago, no dudes en decírmelo. Estoy aquí para ayudarte.";
    } else if (lowerMessage.includes("gracias") || lowerMessage.includes("adiós")) {
        respuesta = "¡Muchas gracias por confiar en Estudio MB! Recuerda que siempre estaremos aquí para ayudarte con lo que necesites. Espero verte pronto y que tengas un excelente día. ¡Cuídate mucho! 😊";
    } else {
        respuesta = "Mmm, no estoy seguro de haber entendido bien. Pero no te preocupes, quiero ayudarte. ¿Podrías explicar un poco más o repetir tu pregunta? Estoy aquí para resolver tus dudas.";
    }

    setTimeout(() => agregarMensaje("Chatbot", respuesta), 1000);
}

});