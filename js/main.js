/**
 * JavaScript principal para o convite de 15 anos de Maria Eduarda
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicialização Geral
    initGiftTabs();
    initGiftCarousel();
    initPixCopy();
    initMuralCeu();
    initGaleriaFotos();
});

/* ==========================================================================
   1. ABAS DE SUGESTÕES DE PRESENTES
   ========================================================================== */
function initGiftTabs() {
    const btnMimos = document.getElementById('btn-lista-mimos');
    const btnPix = document.getElementById('btn-pix');
    const contentMimos = document.getElementById('content-lista-mimos');
    const contentPix = document.getElementById('content-pix');

    if (!btnMimos || !btnPix || !contentMimos || !contentPix) return;

    btnMimos.addEventListener('click', () => {
        btnMimos.classList.add('active');
        btnPix.classList.remove('active');
        contentMimos.classList.remove('hidden');
        contentPix.classList.add('hidden');
    });

    btnPix.addEventListener('click', () => {
        btnPix.classList.add('active');
        btnMimos.classList.remove('active');
        contentPix.classList.remove('hidden');
        contentMimos.classList.add('hidden');
    });
}

/* ==========================================================================
   2. CARROSSEL DE MIMOS
   ========================================================================== */
function initGiftCarousel() {
    const track = document.getElementById('gift-carousel-track');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    const dotsContainer = document.getElementById('gift-carousel-dots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = Array.from(track.children);
    let currentIndex = 0;

    function getItemsPerView() {
        return window.innerWidth <= 768 ? 1 : 3;
    }

    function updateCarousel() {
        const itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, cards.length - itemsPerView);

        // Clampar o index atual
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        // Mover o track
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = 20; // Defino no CSS
        const amountToMove = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${amountToMove}px)`;

        // Atualizar os dots
        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Ocultar setas se tudo estiver visível
        if (maxIndex === 0) {
            prevBtn.style.opacity = '0.3';
            prevBtn.style.pointerEvents = 'none';
            nextBtn.style.opacity = '0.3';
            nextBtn.style.pointerEvents = 'none';
        } else {
            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
            nextBtn.style.opacity = currentIndex === maxIndex ? '0.3' : '1';
            nextBtn.style.pointerEvents = currentIndex === maxIndex ? 'none' : 'auto';
        }
    }

    // Criar/atualizar bolinhas com base no número de visualizações possíveis
    function setupDots() {
        dotsContainer.innerHTML = '';
        const itemsPerView = getItemsPerView();
        const numberOfDots = Math.max(1, cards.length - itemsPerView + 1);

        for (let i = 0; i < numberOfDots; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        const itemsPerView = getItemsPerView();
        if (currentIndex < cards.length - itemsPerView) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Iniciar
    setupDots();
    updateCarousel();

    // Redimensionamento
    window.addEventListener('resize', () => {
        setupDots();
        updateCarousel();
    });
}

/* ==========================================================================
   3. COPIAR CHAVE PIX
   ========================================================================== */
function initPixCopy() {
    const btnCopiar = document.getElementById('btn-copiar-pix');
    const keyEl = document.getElementById('pix-key');

    if (!btnCopiar || !keyEl) return;

    btnCopiar.addEventListener('click', () => {
        const textToCopy = keyEl.textContent.trim();
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                const originalText = btnCopiar.textContent;
                btnCopiar.textContent = 'Chave Copiada! ✓';
                btnCopiar.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
                btnCopiar.style.color = '#ffffff';

                setTimeout(() => {
                    btnCopiar.textContent = originalText;
                    btnCopiar.style.background = '';
                    btnCopiar.style.color = '';
                }, 2500);
            })
            .catch(err => {
                console.error('Falha ao copiar: ', err);
                alert('Chave PIX: ' + textToCopy);
            });
    });
}

/* ==========================================================================
   4. MURAL: DEIXE SUA ESTRELA NO CÉU
   ========================================================================== */
/* ==========================================================================
   4. MURAL: DEIXE SUA ESTRELA NO CÉU
   ========================================================================== */
function initMuralCeu() {
    const form = document.getElementById('form-mensagem');
    const ceu = document.getElementById('ceu-mural');
    const ceuContent = document.getElementById('ceu-mural-content');
    const modalOverlay = document.getElementById('modal-mensagem-overlay');
    const popup = document.getElementById('mensagem-popup');
    const popupClose = document.getElementById('btn-close-popup');
    
    const popupDe = document.getElementById('popup-de');
    const popupMusica = document.getElementById('popup-musica');
    const popupMsg = document.getElementById('popup-mensagem');

    if (!form || !ceu || !ceuContent || !modalOverlay) return;

    const LOCAL_STORAGE_KEY = 'convite_duda_mensagens';
    let mensagensCache = [];

    // Obter mensagens salvas no localStorage
    function getMensagensLocal() {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Salvar mensagens no localStorage
    function salvarMensagensLocal(mensagens) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mensagens));
    }

    // Renderiza uma estrela individual no céu
    function renderEstrela(msg, index, total, ceuWidth) {
        const estrela = document.createElement('div');
        estrela.classList.add('message-star');
        
        if (!msg.x || !msg.y) {
            const safeTotal = Math.max(1, total);
            const segmentWidth = (ceuWidth - 160) / safeTotal;
            msg.x = Math.floor(segmentWidth * index + 60 + Math.random() * (segmentWidth * 0.5));
            msg.y = Math.floor(40 + Math.random() * 160);
        }

        estrela.style.left = `${msg.x}px`;
        estrela.style.top = `${msg.y}px`;

        const img = document.createElement('img');
        img.src = 'assets/images/estrelaVanGogh.png';
        img.alt = 'Estrela';
        estrela.appendChild(img);

        const tooltip = document.createElement('span');
        tooltip.classList.add('tooltip-name');
        tooltip.textContent = msg.nome;
        estrela.appendChild(tooltip);

        estrela.addEventListener('click', (e) => {
            if (isDragging) return;
            e.stopPropagation();
            popupDe.textContent = msg.nome;
            popupMusica.textContent = msg.musica ? msg.musica : 'Nenhuma selecionada';
            popupMsg.textContent = msg.mensagem;
            
            modalOverlay.classList.remove('hidden');
        });

        ceuContent.appendChild(estrela);
    }

    // Renderizar todo o céu
    function atualizarCeu() {
        const estrelasExistentes = ceuContent.querySelectorAll('.message-star');
        estrelasExistentes.forEach(star => star.remove());

        const minWidth = Math.max(window.innerWidth, mensagensCache.length * 150 + 300);
        ceuContent.style.width = `${minWidth}px`;

        if (mensagensCache.length === 0) return;

        let atualizado = false;
        mensagensCache.forEach((msg, idx) => {
            if (!msg.x || !msg.y) {
                atualizado = true;
            }
            renderEstrela(msg, idx, mensagensCache.length, minWidth);
        });

        if (atualizado) {
            salvarMensagensLocal(mensagensCache);
        }
    }

    async function carregarMensagens() {
        if (typeof apiBuscarMensagens === 'function') {
            const remoteData = await apiBuscarMensagens();
            if (remoteData && Array.isArray(remoteData)) {
                mensagensCache = remoteData;
                salvarMensagensLocal(mensagensCache);
                atualizarCeu();
                return;
            }
        }
        mensagensCache = getMensagensLocal();
        atualizarCeu();
    }

    // Funcionalidade Drag-to-Scroll
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;

    ceu.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragging = false;
        ceu.classList.add('active');
        startX = e.pageX - ceu.offsetLeft;
        scrollLeft = ceu.scrollLeft;
    });

    ceu.addEventListener('mouseleave', () => {
        isDown = false;
        ceu.classList.remove('active');
    });

    ceu.addEventListener('mouseup', () => {
        isDown = false;
        ceu.classList.remove('active');
    });

    ceu.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - ceu.offsetLeft;
        const walk = (x - startX) * 1.5;
        if (Math.abs(walk) > 5) {
            isDragging = true;
        }
        ceu.scrollLeft = scrollLeft - walk;
    });

    ceu.addEventListener('touchstart', (e) => {
        isDown = true;
        isDragging = false;
        startX = e.touches[0].pageX - ceu.offsetLeft;
        scrollLeft = ceu.scrollLeft;
    }, { passive: true });

    ceu.addEventListener('touchend', () => {
        isDown = false;
    });

    ceu.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - ceu.offsetLeft;
        const walk = (x - startX) * 1.5;
        if (Math.abs(walk) > 5) {
            isDragging = true;
        }
        ceu.scrollLeft = scrollLeft - walk;
    }, { passive: true });

    // Formulário de Envio
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const inputNome = document.getElementById('mural-nome');
        const inputMusica = document.getElementById('mural-musica');
        const inputTexto = document.getElementById('mural-texto');
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!inputNome || !inputTexto) return;

        const nome = inputNome.value.trim();
        const musica = inputMusica.value.trim();
        const mensagem = inputTexto.value.trim();

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = '✈ Enviando...';
        }

        const novaMsg = { nome, musica, mensagem, x: null, y: null };

        try {
            if (typeof apiEnviarMensagem === 'function') {
                await apiEnviarMensagem(nome, musica, mensagem);
            }
        } catch (err) {
            console.warn('Erro ao salvar no Supabase, salvando localmente:', err);
        }

        mensagensCache.push(novaMsg);
        salvarMensagensLocal(mensagensCache);

        form.reset();
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '✈ Enviar';
        }

        atualizarCeu();

        setTimeout(() => {
            const estrelas = ceuContent.querySelectorAll('.message-star');
            if (estrelas.length > 0) {
                const ultimaEstrela = estrelas[estrelas.length - 1];
                ceu.scrollTo({
                    left: ultimaEstrela.offsetLeft - ceu.clientWidth / 2,
                    behavior: 'smooth'
                });
                
                popupDe.textContent = novaMsg.nome;
                popupMusica.textContent = novaMsg.musica ? novaMsg.musica : 'Nenhuma selecionada';
                popupMsg.textContent = novaMsg.mensagem;
                modalOverlay.classList.remove('hidden');
            }
        }, 300);
    });

    if (popupClose) {
        popupClose.addEventListener('click', () => {
            modalOverlay.classList.add('hidden');
        });
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.add('hidden');
        }
    });

    carregarMensagens();
}

/* ==========================================================================
   5. GALERIA: MOMENTOS INESQUECÍVEIS (INDEXEDDB E FOTOS)
   ========================================================================== */
function initGaleriaFotos() {
    const btnUpload = document.getElementById('btn-upload');
    const fileInput = document.getElementById('input-foto');
    const track = document.getElementById('gallery-track');
    
    const prevBtn = document.querySelector('.prev-photo');
    const nextBtn = document.querySelector('.next-photo');
    const dotsContainer = document.getElementById('gallery-dots');

    const btnVerTodas = document.getElementById('btn-ver-todas');
    const modal = document.getElementById('gallery-modal');
    const modalClose = document.getElementById('btn-close-modal');
    const modalGrid = document.getElementById('modal-grid');

    if (!btnUpload || !fileInput || !track || !prevBtn || !nextBtn || !dotsContainer || !btnVerTodas || !modal || !modalClose || !modalGrid) return;

    let galleryPhotos = [];
    let currentPhotoIndex = 0;

    // Configuração e Lógica do IndexedDB para fotos (persistência binária)
    const DB_NAME = 'DudaGaleriaDB';
    const DB_VERSION = 1;
    const STORE_NAME = 'fotos';

    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { autoIncrement: true });
                }
            };
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    async function salvarFotoDB(base64) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(base64);
            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e.target.error);
        });
    }

    async function carregarFotosDB() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    // Atualiza a visualização do carrossel da galeria
    function updateGallery() {
        track.innerHTML = '';
        dotsContainer.innerHTML = '';

        if (galleryPhotos.length === 0) {
            // Se não houver fotos, mostra o placeholder
            const placeholder = document.createElement('div');
            placeholder.classList.add('gallery-photo-placeholder');
            placeholder.innerHTML = '<p>Nenhuma foto compartilhada ainda. Seja o primeiro a compartilhar!</p>';
            track.appendChild(placeholder);
            
            prevBtn.style.opacity = '0.3';
            prevBtn.style.pointerEvents = 'none';
            nextBtn.style.opacity = '0.3';
            nextBtn.style.pointerEvents = 'none';
            btnVerTodas.style.display = 'none';
            return;
        }

        btnVerTodas.style.display = 'inline-block';

        // Renderizar fotos no carrossel
        galleryPhotos.forEach((photoSrc, idx) => {
            const item = document.createElement('div');
            item.classList.add('gallery-photo-item');
            
            const img = document.createElement('img');
            img.src = photoSrc;
            img.alt = `Foto compartilhada ${idx + 1}`;
            
            item.appendChild(img);
            track.appendChild(item);

            // Criar dot
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (idx === currentPhotoIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentPhotoIndex = idx;
                slideGallery();
            });
            dotsContainer.appendChild(dot);
        });

        slideGallery();
    }

    function slideGallery() {
        if (galleryPhotos.length === 0) return;
        
        // Tratar limites
        if (currentPhotoIndex < 0) currentPhotoIndex = 0;
        if (currentPhotoIndex >= galleryPhotos.length) currentPhotoIndex = galleryPhotos.length - 1;

        track.style.transform = `translateX(-${currentPhotoIndex * 100}%)`;

        // Atualizar dots ativos
        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, idx) => {
            if (idx === currentPhotoIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Atualizar setas
        prevBtn.style.opacity = currentPhotoIndex === 0 ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentPhotoIndex === 0 ? 'none' : 'auto';
        nextBtn.style.opacity = currentPhotoIndex === galleryPhotos.length - 1 ? '0.3' : '1';
        nextBtn.style.pointerEvents = currentPhotoIndex === galleryPhotos.length - 1 ? 'none' : 'auto';
    }

    // Botões de navegação
    prevBtn.addEventListener('click', () => {
        if (currentPhotoIndex > 0) {
            currentPhotoIndex--;
            slideGallery();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPhotoIndex < galleryPhotos.length - 1) {
            currentPhotoIndex++;
            slideGallery();
        }
    });

    // Seletor de arquivos
    btnUpload.addEventListener('click', () => {
        fileInput.click();
    });

    // Processar upload de fotos
    fileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        btnUpload.textContent = 'Enviando fotos...';
        btnUpload.style.pointerEvents = 'none';

        for (const file of files) {
            try {
                if (typeof apiEnviarFoto === 'function') {
                    const photoUrl = await apiEnviarFoto(file);
                    if (photoUrl) {
                        galleryPhotos.push(photoUrl);
                    }
                }
            } catch (err) {
                console.error('Erro ao enviar foto para o Supabase: ', err);
                alert('Erro ao enviar a foto. Verifique se o bucket e as permissões estão ativos no Supabase.');
            }
        }

        btnUpload.innerHTML = '<span class="camera-icon">📷</span> Compartilhe suas fotos da festa!';
        btnUpload.style.pointerEvents = 'auto';
        fileInput.value = '';

        currentPhotoIndex = Math.max(0, galleryPhotos.length - 1);
        updateGallery();
    });

    btnVerTodas.addEventListener('click', () => {
        modalGrid.innerHTML = '';
        
        galleryPhotos.forEach(photoSrc => {
            const img = document.createElement('img');
            img.src = photoSrc;
            img.alt = 'Foto da Festa';
            modalGrid.appendChild(img);
        });

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });

    modalClose.addEventListener('click', () => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });

    async function inicializarFotos() {
        if (typeof apiBuscarFotos === 'function') {
            const remoteFotos = await apiBuscarFotos();
            if (remoteFotos && Array.isArray(remoteFotos)) {
                // Usar estritamente as fotos do Supabase (mesmo se o array estiver vazio [])
                galleryPhotos = remoteFotos;
                updateGallery();
                return;
            }
        }
        galleryPhotos = [];
        updateGallery();
    }

    inicializarFotos();
}
