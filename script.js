// ================================================================
//  NAPTIP EVIDENCE RESPONSE - Main JavaScript
//  Created by Kevin Olubiyi
// ================================================================

(function() {
    'use strict';

    // ================================================================
    // 1. HERO CAROUSEL - Horizontal Auto-Scrolling
    // ================================================================
    const carousel = document.getElementById('heroCarousel');
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoPlayInterval = null;
    const AUTO_PLAY_DELAY = 5000;
    let isTransitioning = false;

    function goToSlide(index) {
        if (isTransitioning) return;
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        isTransitioning = true;
        currentIndex = index;
        
        const translateX = -index * 25;
        carousel.style.transform = `translateX(${translateX}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        resetAutoPlay();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function resetAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        startAutoPlay();
    }

    function startAutoPlay() {
        if (autoPlayInterval) return;
        autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    // Event Listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToSlide(index);
        });
    });

    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        prevSlide();
    });

    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        nextSlide();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            e.preventDefault();
        }
    });

    const carouselWrapper = document.querySelector('.hero-carousel-wrapper');
    carouselWrapper.addEventListener('mouseenter', stopAutoPlay);
    carouselWrapper.addEventListener('mouseleave', startAutoPlay);

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;

    carouselWrapper.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        isSwiping = true;
    }, { passive: true });

    carouselWrapper.addEventListener('touchmove', function(e) {
        // Optional
    }, { passive: true });

    carouselWrapper.addEventListener('touchend', function(e) {
        if (!isSwiping) return;
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        isSwiping = false;
    }, { passive: true });

    // ================================================================
    // 2. NAVIGATION - Active state & smooth scroll
    // ================================================================
    const navLinks = document.querySelectorAll('.nav-tabs a');
    const sections = document.querySelectorAll('.section-card');
    const navTabs = document.getElementById('navTabs');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 120) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) return;
        scrollTimeout = requestAnimationFrame(() => {
            updateActiveNav();
            scrollTimeout = null;
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = navTabs.offsetHeight + 20;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================================================================
    // 3. MODAL - Document/Image/Audio Preview
    // ================================================================
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.getElementById('closeModal');

    const filePreviews = {
        'Petition Response Letter': { type: 'pdf', icon: 'fa-file-pdf', color: '#e74c3c' },
        'NAPTIP Case Reference': { type: 'pdf', icon: 'fa-file-pdf', color: '#e74c3c' },
        'School Fee Receipts': { type: 'pdf', icon: 'fa-file-pdf', color: '#e74c3c' },
        'Hospital Bills': { type: 'pdf', icon: 'fa-file-pdf', color: '#e74c3c' },
        "Children's Testimony": { type: 'audio', icon: 'fa-microphone', color: '#27ae60' },
        'Voice Note – Threat': { type: 'audio', icon: 'fa-microphone', color: '#e67e22' },
        'Voice Note – Bible threat': { type: 'audio', icon: 'fa-microphone', color: '#e67e22' },
        'Transcripts': { type: 'pdf', icon: 'fa-file-lines', color: '#2b5797' },
        'Timeline of Departure': { type: 'pdf', icon: 'fa-calendar-alt', color: '#8e44ad' },
        'Witness Statements': { type: 'pdf', icon: 'fa-user', color: '#2980b9' },
        'Rent Agreements': { type: 'pdf', icon: 'fa-receipt', color: '#27ae60' },
        'Bank Statements': { type: 'pdf', icon: 'fa-building-columns', color: '#2c3e50' },
        'Business Registration': { type: 'pdf', icon: 'fa-certificate', color: '#f39c12' },
        'Turnover Records': { type: 'pdf', icon: 'fa-chart-line', color: '#2ecc71' },
        'Evidence of Collapse': { type: 'pdf', icon: 'fa-triangle-exclamation', color: '#e74c3c' },
        'Certificates': { type: 'image', icon: 'fa-images', color: '#9b59b6' },
        'School Results': { type: 'pdf', icon: 'fa-file-pdf', color: '#e74c3c' },
        'Community Statements': { type: 'pdf', icon: 'fa-users', color: '#2980b9' },
        'Family Records': { type: 'pdf', icon: 'fa-file-lines', color: '#8e44ad' },
        'Testimonies': { type: 'audio', icon: 'fa-microphone', color: '#27ae60' }
    };

    function getFileInfo(fileName) {
        if (filePreviews[fileName]) return filePreviews[fileName];
        for (const key in filePreviews) {
            if (fileName.includes(key) || key.includes(fileName)) {
                return filePreviews[key];
            }
        }
        return { type: 'document', icon: 'fa-file', color: '#6a7a90' };
    }

    function openModal(fileName, ext) {
        const info = getFileInfo(fileName);
        modalTitle.textContent = fileName;

        let html = '';
        const icon = info.icon || 'fa-file';
        const color = info.color || '#6a7a90';

        switch (info.type) {
            case 'image':
                html = `
                    <div style="text-align:center; margin:1rem 0;">
                        <img src="images/${fileName.replace(/[^a-zA-Z0-9]/g, '_')}.jpg" 
                             alt="${fileName}" 
                             class="preview-image"
                             onerror="this.style.display='none'; document.getElementById('fallbackMsg').style.display='block';"
                             style="max-height:500px; object-fit:contain; width:100%; border-radius:12px;" />
                        <div id="fallbackMsg" style="display:none; padding:2rem; background:#0f1a2b; border-radius:12px; color:#8a9ab0; border:1px solid #2a3a4a;">
                            <i class="fas fa-image" style="font-size:2rem; display:block; margin-bottom:0.5rem; color:#c9a84c;"></i>
                            Image preview not available. File: <strong style="color:#e8ecf0;">${fileName}</strong>
                        </div>
                    </div>
                `;
                break;

            case 'audio':
                html = `
                    <div style="margin:1rem 0; padding:1rem; background:#0f1a2b; border-radius:12px; border:1px solid #2a3a4a;">
                        <div style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
                            <i class="fas fa-microphone" style="font-size:2rem; color:#c9a84c;"></i>
                            <div style="flex:1; min-width:150px;">
                                <div style="font-weight:600; color:#e8ecf0; margin-bottom:0.3rem;">${fileName}</div>
                                <div style="font-size:0.85rem; color:#8a9ab0;">Audio file ready for playback</div>
                            </div>
                            <button onclick="alert('Audio playback would start here.')" 
                                    style="background:#c9a84c; color:#0a121f; border:none; padding:0.6rem 1.5rem; border-radius:30px; cursor:pointer; font-weight:600;">
                                <i class="fas fa-play"></i> Play Audio
                            </button>
                        </div>
                    </div>
                    <div style="background:#0f1a2b; border-radius:12px; padding:1.5rem; text-align:center; border:1px solid #2a3a4a;">
                        <i class="fas fa-wave-square" style="font-size:2rem; color:#c9a84c; display:block; margin-bottom:0.5rem;"></i>
                        <div style="font-size:0.85rem; color:#8a9ab0;">Audio waveform visualization would appear here</div>
                        <div style="height:40px; background:linear-gradient(to right, rgba(201,168,76,0.1), rgba(201,168,76,0.3), rgba(201,168,76,0.1)); border-radius:8px; margin-top:0.5rem;"></div>
                    </div>
                `;
                break;

            case 'pdf':
            case 'docx':
            default:
                html = `
                    <div class="preview-placeholder">
                        <i class="fas ${icon}" style="color:${color};"></i>
                        <div class="file-name">${fileName}.${ext || 'pdf'}</div>
                        <div class="preview-hint">
                            <i class="fas fa-file-pdf"></i> Document preview
                        </div>
                        <div style="margin-top:0.8rem; font-size:0.8rem; color:#8a9ab0; background:#0f1a2b; padding:0.5rem 1rem; border-radius:8px; display:inline-block; border:1px solid #2a3a4a;">
                            <i class="fas fa-download"></i> Ready for download
                        </div>
                    </div>
                    <div style="background:#0f1a2b; border-radius:12px; padding:1rem; border:1px solid #2a3a4a; margin-top:0.5rem;">
                        <div style="font-size:0.85rem; color:#8a9ab0; display:flex; align-items:center; gap:0.5rem; justify-content:center;">
                            <i class="fas fa-lock" style="color:#c9a84c;"></i>
                            <span>This document is part of the evidence response</span>
                        </div>
                    </div>
                `;
                break;
        }

        modalBody.innerHTML = html;
        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    // ================================================================
    // 4. EVIDENCE BUTTONS
    // ================================================================
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const fileName = this.getAttribute('data-file') || 'Document';
            const ext = this.getAttribute('data-ext') || 'pdf';
            openModal(fileName, ext);
        });
    });

    // ================================================================
    // 5. AUDIO PLAYERS - Wavesurfer.js integration
    // ================================================================
    const audioPlayers = {};

    function initAudioPlayer(audioId, durationStr) {
        const container = document.getElementById('waveform-' + audioId);
        if (!container) return;

        const parts = durationStr.split(':');
        const duration = parseInt(parts[0]) * 60 + parseInt(parts[1]);

        try {
            if (typeof WaveSurfer !== 'undefined') {
                const wavesurfer = WaveSurfer.create({
                    container: container,
                    waveColor: '#2a3a4a',
                    progressColor: '#c9a84c',
                    cursorColor: '#e8ecf0',
                    cursorWidth: 2,
                    height: 60,
                    barWidth: 3,
                    barGap: 1,
                    barRadius: 3,
                    normalize: true,
                    hideScrollbar: true,
                });

                const sampleRate = 44100;
                const data = new Float32Array(1000);
                for (let i = 0; i < data.length; i++) {
                    data[i] = (Math.random() * 0.8 + 0.2) * Math.sin(i * 0.1) * 0.5 + 0.5;
                }
                wavesurfer.loadDecodedBuffer({
                    getChannelData: () => data,
                    numberOfChannels: 1,
                    length: data.length,
                    sampleRate: sampleRate,
                    duration: duration,
                });

                audioPlayers[audioId] = wavesurfer;
                let isPlaying = false;

                const playBtn = document.querySelector(`.play-btn[data-audio="${audioId}"]`);
                const seekBar = document.querySelector(`.seek-bar[data-audio="${audioId}"]`);
                const timeDisplay = document.getElementById('timeDisplay-' + audioId);

                if (playBtn) {
                    playBtn.addEventListener('click', function() {
                        if (isPlaying) {
                            wavesurfer.pause();
                            this.innerHTML = '<i class="fas fa-play"></i>';
                            isPlaying = false;
                        } else {
                            wavesurfer.play();
                            this.innerHTML = '<i class="fas fa-pause"></i>';
                            isPlaying = true;
                        }
                    });
                }

                if (seekBar) {
                    seekBar.addEventListener('input', function() {
                        const progress = parseFloat(this.value);
                        wavesurfer.seekTo(progress);
                        if (timeDisplay) {
                            const time = progress * duration;
                            const mins = Math.floor(time / 60);
                            const secs = Math.floor(time % 60);
                            timeDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')} / ${durationStr}`;
                        }
                    });
                }

                wavesurfer.on('audioprocess', function() {
                    const current = wavesurfer.getCurrentTime();
                    const progress = duration > 0 ? current / duration : 0;
                    if (seekBar) seekBar.value = progress;
                    if (timeDisplay) {
                        const mins = Math.floor(current / 60);
                        const secs = Math.floor(current % 60);
                        timeDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')} / ${durationStr}`;
                    }
                });

                wavesurfer.on('finish', function() {
                    isPlaying = false;
                    if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    if (seekBar) seekBar.value = 0;
                    if (timeDisplay) timeDisplay.textContent = `0:00 / ${durationStr}`;
                });

            } else {
                container.innerHTML = `
                    <div style="display:flex; align-items:center; justify-content:center; height:100%; color:#8a9ab0; font-size:0.8rem; gap:0.5rem;">
                        <i class="fas fa-wave-square"></i>
                        <span>Audio waveform</span>
                        <span style="background:rgba(201,168,76,0.1); padding:0.1rem 0.6rem; border-radius:12px; font-size:0.7rem; color:#c9a84c;">${durationStr}</span>
                    </div>
                `;
            }
        } catch (e) {
            console.warn('Waveform init failed:', e);
            container.innerHTML = `
                <div style="display:flex; align-items:center; justify-content:center; height:100%; color:#8a9ab0; font-size:0.8rem;">
                    <i class="fas fa-wave-square" style="margin-right:0.5rem; color:#c9a84c;"></i>
                    <span>Audio ready</span>
                </div>
            `;
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            initAudioPlayer('testimony', '2:34');
            initAudioPlayer('threat', '0:48');
        }, 500);
    });

    // ================================================================
    // 6. SECTION HIGHLIGHT ON NAV CLICK
    // ================================================================
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const targetId = this.getAttribute('href');
            if (targetId) {
                setTimeout(() => {
                    const target = document.querySelector(targetId);
                    if (target) {
                        target.classList.add('highlight');
                        setTimeout(() => {
                            target.classList.remove('highlight');
                        }, 800);
                    }
                }, 100);
            }
        });
    });

    // ================================================================
    // 7. KEYBOARD ACCESSIBILITY
    // ================================================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
            closeModal();
        }
    });

    // ================================================================
    // 8. RESIZE HANDLER
    // ================================================================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            for (const id in audioPlayers) {
                try {
                    audioPlayers[id].drawer.updateWidth();
                } catch (e) { /* ignore */ }
            }
        }, 300);
    });

    // ================================================================
    // 9. INITIALIZE CAROUSEL
    // ================================================================
    startAutoPlay();

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });

    // ================================================================
    // 10. EXPOSE FUNCTIONS GLOBALLY
    // ================================================================
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.goToSlide = goToSlide;
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;

    console.log('NAPTIP Evidence Response initialized.');
    console.log('Created by Kevin Olubiyi | GCIIP Founder');

})();