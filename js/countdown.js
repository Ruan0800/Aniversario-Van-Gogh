/**
 * Cronômetro (Countdown) para o aniversário de 15 anos da Maria Eduarda
 */

document.addEventListener('DOMContentLoaded', () => {
    const countdownContainer = document.getElementById('countdown');
    if (!countdownContainer) return;

    // 1. Data alvo do evento: 17 de setembro de 2026 às 19:00:00
    // Nota: O mês no construtor Date() do JavaScript é indexado em zero (0 = Janeiro, 8 = Setembro).
    const targetDate = new Date(2026, 8, 17, 19, 0, 0);

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

        // Se a data do evento já tiver passado, exibe mensagem amigável e limpa o intervalo
        if (difference <= 0) {
            countdownContainer.innerHTML = '<span class="countdown-message" style="font-family: var(--font-title); color: var(--gold-light); font-size: 1.5rem; text-shadow: 0 0 8px var(--gold); letter-spacing: 1px;">O grande dia chegou!</span>';
            clearInterval(countdownInterval);
            return;
        }

        // 2. Converte a diferença em milissegundos
        const msInSecond = 1000;
        const msInMinute = msInSecond * 60;
        const msInHour = msInMinute * 60;
        const msInDay = msInHour * 24;

        // 3. Calcula Dias, Horas, Minutos e Segundos
        const days = Math.floor(difference / msInDay);
        const hours = Math.floor((difference % msInDay) / msInHour);
        const minutes = Math.floor((difference % msInHour) / msInMinute);
        const seconds = Math.floor((difference % msInMinute) / msInSecond);

        // 4. Renderiza dinamicamente os blocos na tela
        countdownContainer.innerHTML =
            createCountdownHTML(days, 'Dias') +
            '<div class="countdown-separator">:</div>' +
            createCountdownHTML(hours, 'Horas') +
            '<div class="countdown-separator">:</div>' +
            createCountdownHTML(minutes, 'Minutos') +
            '<div class="countdown-separator">:</div>' +
            createCountdownHTML(seconds, 'Segundos');
    };

    // Executa imediatamente para evitar o delay inicial
    updateCountdown();

    // Atualiza o contador a cada 1 segundo
    const countdownInterval = setInterval(updateCountdown, 1000);
});