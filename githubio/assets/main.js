/**
 * Main JavaScript for Berkay Yavuz Personal Website
 * Pure vanilla JS - no dependencies
 */

(function() {
    'use strict';

    /**
     * Smooth scroll for navigation links
     * Tüm anchor linklerine smooth scroll ekler
     */
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Sadece gerçek anchor linkler için çalışsın (# ile başlayan)
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // Header yüksekliğini hesaba kat
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Mobil menüyü kapat
                        closeMobileMenu();
                    }
                }
            });
        });
    }

    /**
     * Mobile menu toggle functionality
     * Hamburger menüyü açıp kapatır
     */
    function initMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
            
            // Menü dışına tıklandığında menüyü kapat
            document.addEventListener('click', function(e) {
                const isClickInsideNav = navMenu.contains(e.target) || navToggle.contains(e.target);
                
                if (!isClickInsideNav && navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        }
    }

    /**
     * Mobile menüyü kapat
     */
    function closeMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }

    /**
     * Scroll animasyonları (opsiyonel)
     * Sayfa kaydırıldığında elementlere fade-in efekti ekler
     */
    function initScrollAnimations() {
        // Intersection Observer API kullanarak görünür elementleri tespit et
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        // Bir kez animasyon eklendikten sonra observer'ı kaldır
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            // Animasyon uygulanacak elementleri seç
            const animatedElements = document.querySelectorAll(
                '.project-card, .blog-card, .product-card, .service-item'
            );
            
            animatedElements.forEach(el => {
                observer.observe(el);
            });
        }
    }

    /**
     * Active navigation link highlighting
     * Scroll pozisyonuna göre aktif menü linkini vurgular
     */
    function initActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        function updateActiveLink() {
            const scrollPosition = window.scrollY + 100; // Header yüksekliği + offset
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        // Scroll event listener (throttled)
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateActiveLink();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // İlk yüklemede de kontrol et
        updateActiveLink();
    }

    /**
     * Header scroll detection - adds shadow and blur after ~30px scroll
     * Header'a scroll sonrası shadow ve blur efekti ekler
     */
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    if (window.scrollY > 30) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * Dark mode toggle functionality
     * Karanlık mod açma/kapama fonksiyonu
     */
    function initDarkMode() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle?.querySelector('.theme-icon');
        
        if (!themeToggle || !themeIcon) return;
        
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark-mode');
            themeIcon.textContent = '☀️';
        }
        
        themeToggle.addEventListener('click', function() {
            document.documentElement.classList.toggle('dark-mode');
            const isDark = document.documentElement.classList.contains('dark-mode');
            
            // Save preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // Update icon
            themeIcon.textContent = isDark ? '☀️' : '🌙';
        });
    }

    /**
     * Parallax effect for hero background (lightweight CSS-only approach)
     * Hero arka planı için hafif parallax efekti
     */
    function initHeroParallax() {
        const heroBackground = document.querySelector('.hero-background');
        if (!heroBackground) return;
        
        // Subtle parallax on scroll (CSS transform only, no heavy JS)
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const scrolled = window.scrollY;
                    const parallaxSpeed = 0.3;
                    heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * Scroll Progress Bar
     * Sayfa scroll ilerlemesini gösteren üstteki progress bar
     */
    function initScrollProgress() {
        const progressBar = document.getElementById('scroll-progress');
        if (!progressBar) return;
        
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const windowHeight = window.innerHeight;
                    const documentHeight = document.documentElement.scrollHeight;
                    const scrollTop = window.scrollY;
                    const scrollableHeight = documentHeight - windowHeight;
                    const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
                    
                    progressBar.style.width = Math.min(progress, 100) + '%';
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * 3D Tilt Effect for Cards
     * Kartlara 3D tilt efekti ekler (touch cihazlarda devre dışı)
     */
    function initCardTilt() {
        // Touch device kontrolü
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;
        
        const tiltCards = document.querySelectorAll('.tilt-card');
        if (!tiltCards.length) return;
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                // Subtle tilt effect
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.015)`;
            });
            
            card.addEventListener('mouseleave', function() {
                card.style.transform = '';
            });
        });
    }

    /**
     * Sayfa yüklendiğinde tüm fonksiyonları başlat
     */
    function init() {
        initSmoothScroll();
        initMobileMenu();
        initScrollAnimations();
        initActiveNavLink();
        initHeaderScroll();
        initDarkMode();
        initHeroParallax();
        initScrollProgress();
        initCardTilt();
        
        console.log('Website initialized successfully!');
    }

    // DOM yüklendiğinde başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM zaten yüklenmişse direkt başlat
        init();
    }

})();

