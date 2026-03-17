/**
 * script.js - 충북대학교 경영정보학과 홈페이지 상호작용 및 애니메이션
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Header Scroll Effect (Mobile toggle removed)
    const header = document.getElementById('site-header');
    const loginModal = document.getElementById('login-modal');
    const loginOpenBtn = document.getElementById('login-open');
    const loginCloseBtn = document.getElementById('login-close');

    // Login Modal Toggle
    if (loginOpenBtn && loginModal && loginCloseBtn) {
        loginOpenBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // 스크롤 방지
        });

        loginCloseBtn.addEventListener('click', () => {
            loginModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // 모달 바깥쪽 클릭 시 닫기
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animation for Category Cards
    const revealElements = document.querySelectorAll('.reveal-card');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 언옵저브하여 한번만 나타나게 함
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // 요소가 100px 화면에 들어왔을 때 애니메이션 실행
        threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 4. Smooth Scrolling for Anchor Links (추가 패딩 계산하여 헤더 가려짐 방지)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.getElementById('site-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Contact Form Validation and Security
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const formData = new FormData(contactForm);
            
            // Helper function to show error
            const showError = (fieldId, show) => {
                const field = document.getElementById(fieldId);
                const parent = field.closest('.form-group');
                if (show) {
                    parent.classList.add('invalid');
                    isValid = false;
                } else {
                    parent.classList.remove('invalid');
                }
            };
            
            // Validate Name
            const name = document.getElementById('user-name').value.trim();
            showError('user-name', name.length < 2);
            
            // Validate Email (Regular Expression for security)
            const email = document.getElementById('user-email').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            showError('user-email', !emailRegex.test(email));
            
            // Validate Message
            const message = document.getElementById('user-message').value.trim();
            showError('user-message', message.length < 10);
            
            // Validate Privacy Policy
            const privacy = document.getElementById('privacy-policy').checked;
            showError('privacy-policy', !privacy);
            
            if (isValid) {
                // xss prevention: sanitize inputs before "sending"
                const sanitizedData = {
                    name: name.replace(/[<>]/g, ""),
                    email: email,
                    subject: document.getElementById('user-subject').value.trim().replace(/[<>]/g, ""),
                    message: message.replace(/[<>]/g, "")
                };
                
                console.log('Form Submitted Safely:', sanitizedData);
                
                // Show Success Message (Simple alert for demonstration)
                alert('문의가 성공적으로 접수되었습니다. 감사합니다!');
                contactForm.reset();
                
                // Remove all invalid classes
                document.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('invalid');
                });
            }
        });

        // 실시간 유효성 검사 (Optional UX Improvement)
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const parent = input.closest('.form-group');
                if (parent.classList.contains('invalid')) {
                    if (input.type === 'checkbox') {
                        if (input.checked) parent.classList.remove('invalid');
                    } else if (input.value.trim().length > 0) {
                        parent.classList.remove('invalid');
                    }
                }
            });
        });
    }

});
