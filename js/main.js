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
function initMuralCeu() {
    const form = document.getElementById('form-mensagem');
    const ceu = document.getElementById('ceu-mural');
    const popup = document.getElementById('mensagem-popup');
    const popupClose = document.getElementById('btn-close-popup');
    
    const popupDe = document.getElementById('popup-de');
    const popupMusica = document.getElementById('popup-musica');
    const popupMsg = document.getElementById('popup-mensagem');

    if (!form || !ceu || !popup) return;

    const LOCAL_STORAGE_KEY = 'convite_duda_mensagens';

    // Obter mensagens salvas no localStorage
    function getMensagens() {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Salvar mensagens no localStorage
    function salvarMensagens(mensagens) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mensagens));
    }

    // Renderiza uma estrela individual no céu
    function renderEstrela(msg, index, total) {
        const estrela = document.createElement('div');
        estrela.classList.add('message-star');
        
        // Determinar coordenadas de posicionamento
        // O céu se expande horizontalmente com o número de estrelas
        const ceuWidth = Math.max(window.innerWidth, total * 120 + 200);
        ceu.style.minWidth = `${ceuWidth}px`;

        // Atribuir x e y salvos ou calcular novos
        if (!msg.x || !msg.y) {
            // Dividir o céu em faixas horizontais proporcionais para evitar aglomeração excessiva
            const segmentWidth = (ceuWidth - 200) / total;
            msg.x = Math.floor(segmentWidth * index + 100 + Math.random() * (segmentWidth * 0.4));
            msg.y = Math.floor(60 + Math.random() * 200); // Faixa vertical segura do céu (entre 60px e 260px)
        }

        estrela.style.left = `${msg.x}px`;
        estrela.style.top = `${msg.y}px`;

        // Renderizar a imagem da estrela de Van Gogh
        const img = document.createElement('img');
        img.src = 'assets/images/estrelaVanGogh.png';
        img.alt = 'Estrela';
        estrela.appendChild(img);

        // Tooltip com o nome da pessoa
        const tooltip = document.createElement('span');
        tooltip.classList.add('tooltip-name');
        tooltip.textContent = msg.nome;
        estrela.appendChild(tooltip);

        // Evento de clique para exibir os detalhes no popup
        estrela.addEventListener('click', (e) => {
            e.stopPropagation();
            popupDe.textContent = msg.nome;
            popupMusica.textContent = msg.musica ? msg.musica : 'Nenhuma selecionada';
            popupMsg.textContent = msg.mensagem;
            
            popup.classList.remove('hidden');
            
            // Centralizar visualmente o popup em relação à estrela clicada (opcional)
            // Para simplicidade, o popup fica fixado no centro/baixo do contêiner como no design
        });

        ceu.appendChild(estrela);
    }

    // Renderizar todo o céu
    function atualizarCeu() {
        // Limpar estrelas existentes
        const estrelasExistentes = ceu.querySelectorAll('.message-star');
        estrelasExistentes.forEach(star => star.remove());

        const mensagens = getMensagens();
        
        if (mensagens.length === 0) {
            ceu.style.minWidth = '100%';
            // Céu fica sem nenhuma estrela
            return;
        }

        mensagens.forEach((msg, idx) => {
            renderEstrela(msg, idx, mensagens.length);
        });
    }

    // Formulário de Envio
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputNome = document.getElementById('mural-nome');
        const inputMusica = document.getElementById('mural-musica');
        const inputTexto = document.getElementById('mural-texto');

        if (!inputNome || !inputTexto) return;

        const mensagens = getMensagens();

        // Criar objeto da mensagem
        const novaMsg = {
            nome: inputNome.value.trim(),
            musica: inputMusica.value.trim(),
            mensagem: inputTexto.value.trim(),
            x: null, // Será gerado aleatoriamente no render
            y: null
        };

        mensagens.push(novaMsg);
        salvarMensagens(mensagens);

        // Limpar formulário
        form.reset();

        // Re-renderizar o céu
        atualizarCeu();

        // Rolar o céu até a última estrela adicionada
        setTimeout(() => {
            const estrelas = ceu.querySelectorAll('.message-star');
            if (estrelas.length > 0) {
                const ultimaEstrela = estrelas[estrelas.length - 1];
                ceu.scrollTo({
                    left: ultimaEstrela.offsetLeft - ceu.clientWidth / 2,
                    behavior: 'smooth'
                });
                
                // Simular clique na última estrela para abrir a mensagem recém-enviada
                ultimaEstrela.click();
            }
        }, 300);
    });

    // Fechar popup
    popupClose.addEventListener('click', () => {
        popup.classList.add('hidden');
    });

    // Fechar popup se clicar fora dele no céu
    document.addEventListener('click', (e) => {
        if (!popup.contains(e.target) && !e.target.closest('.message-star')) {
            popup.classList.add('hidden');
        }
    });

    // Iniciar céu
    atualizarCeu();
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

        btnUpload.textContent = 'Carregando fotos...';
        btnUpload.style.pointerEvents = 'none';

        for (const file of files) {
            try {
                const base64 = await convertFileToBase64(file);
                await salvarFotoDB(base64);
                galleryPhotos.push(base64);
            } catch (err) {
                console.error('Erro ao ler ou salvar arquivo: ', err);
            }
        }

        btnUpload.innerHTML = '<span class="camera-icon">📷</span> Compartilhe suas fotos da festa!';
        btnUpload.style.pointerEvents = 'auto';
        fileInput.value = ''; // Reset

        currentPhotoIndex = galleryPhotos.length - 1;
        updateGallery();
    });

    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

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

    carregarFotosDB()
        .then(fotos => {
            galleryPhotos = fotos;
            updateGallery();
        })
        .catch(err => {
            console.error('Erro ao carregar fotos do IndexedDB: ', err);
            updateGallery();
        });
}
