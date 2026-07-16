/**
 * Cronômetro (Countdown) para o aniversário de 15 anos da Maria Eduarda
 */

document.addEventListener('DOMContentLoaded', () => {
    const countdownContainer = document.getElementById('countdown');
    if (!countdownContainer) return;

    // 1. Data alvo do evento: 17 de setembro de 2026 às 19:00:00
    // Nota: O mês no construtor Date() do JavaScript é indexado em zero (0 = Janeiro, 8 = Setembro).
    const targetDate = new Date(2026, 8, 17, 19, 0, 0);

    // ==========================================
    // DATA PARA TESTES (Descomente a linha abaixo para testar o funcionamento com uma data no futuro)
    // const targetDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 10000); // 5 dias e 10 segundos a partir de agora
    // ==========================================

    /**
     * Garante que números menores que 10 tenham um "0" à esquerda
     * @param {number} num 
     * @returns {string}
     */
    const formatNumber = (num) => String(Math.max(0, num)).padStart(2, '0');

    /**
     * Gera a estrutura HTML de cada item de tempo para herdar a estilização do CSS
     * @param {number} value 
     * @param {string} label 
     * @returns {string}
     */
    const createCountdownHTML = (value, label) => {
        return `
            <div class="countdown-item">
                <span class="countdown-number">${formatNumber(value)}</span>
                <span class="countdown-label">${label}</span>
            </div>
        `;
    };

    /**
     * Calcula e atualiza o cronômetro na tela
     */
    const updateCountdown = () => {
        const now = new Date();
        const difference = targetDate - now;

        // 3. Se a data do evento já tiver passado, exibe mensagem amigável e limpa o intervalo
        if (difference <= 0) {
            countdownContainer.innerHTML = '<span class="countdown-message" style="font-family: var(--font-title); color: var(--gold-light); font-size: 1.5rem; text-shadow: 0 0 8px var(--gold); letter-spacing: 1px;">O grande dia chegou!</span>';
            clearInterval(countdownInterval);
            return;
        }

        // 2. Calcula a diferença em Dias, Horas, Minutos e Segundos
        const msInSecond = 1000;
        const msInMinute = msInSecond * 60;
        const msInHour = msInMinute * 60;
        const msInDay = msInHour * 24;

        const days = Math.floor(difference / msInDay);
        const hours = Math.floor((difference % msInDay) / msInHour);
        const minutes = Math.floor((difference % msInHour) / msInMinute);
        const seconds = Math.floor((difference % msInMinute) / msInSecond);

        // 4. Renderiza dinamicamente os blocos com o HTML solicitado
        countdownContainer.innerHTML = 
            createCountdownHTML(days, 'Dias') +
            createCountdownHTML(hours, 'Horas') +
            createCountdownHTML(minutes, 'Minutos') +
            createCountdownHTML(seconds, 'Segundos');
    };

    // Executa imediatamente para evitar o delay de 1 segundo do setInterval inicial
    updateCountdown();

    // 5. Atualiza o contador a cada 1 segundo
    const countdownInterval = setInterval(updateCountdown, 1000);
});
