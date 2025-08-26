// PWA Installation Script for ShrimpSense
// This script handles PWA installation prompts and provides user guidance

(function() {
  'use strict';

  let deferredPrompt;
  let installButton;
  let installBanner;

  // Create install banner
  function createInstallBanner() {
    if (installBanner) return;

    installBanner = document.createElement('div');
    installBanner.className = 'pwa-install-banner';
    installBanner.innerHTML = `
      <div class="pwa-install-content">
        <div class="pwa-install-info">
          <h3>📱 ติดตั้ง ShrimpSense</h3>
          <p>เพิ่มแอปลงหน้าจอหลักเพื่อใช้งานได้สะดวกยิ่งขึ้น</p>
        </div>
        <div class="pwa-install-actions">
          <button class="pwa-install-btn" id="pwa-install-btn">ติดตั้ง</button>
          <button class="pwa-dismiss-btn" id="pwa-dismiss-btn">ไม่ใช่ตอนนี้</button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .pwa-install-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
        z-index: 1000;
        transform: translateY(100%);
        transition: transform 0.3s ease-in-out;
      }
      
      .pwa-install-banner.show {
        transform: translateY(0);
      }
      
      .pwa-install-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1200px;
        margin: 0 auto;
        gap: 20px;
      }
      
      .pwa-install-info h3 {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      .pwa-install-info p {
        margin: 0;
        font-size: 14px;
        opacity: 0.9;
      }
      
      .pwa-install-actions {
        display: flex;
        gap: 12px;
        flex-shrink: 0;
      }
      
      .pwa-install-btn {
        background: white;
        color: #667eea;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .pwa-install-btn:hover {
        background: #f8f9fa;
        transform: translateY(-1px);
      }
      
      .pwa-dismiss-btn {
        background: transparent;
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .pwa-dismiss-btn:hover {
        background: rgba(255,255,255,0.1);
      }
      
      @media (max-width: 768px) {
        .pwa-install-content {
          flex-direction: column;
          text-align: center;
          gap: 16px;
        }
        
        .pwa-install-actions {
          width: 100%;
          justify-content: center;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(installBanner);

    // Add event listeners
    installButton = document.getElementById('pwa-install-btn');
    const dismissButton = document.getElementById('pwa-dismiss-btn');

    installButton.addEventListener('click', handleInstallClick);
    dismissButton.addEventListener('click', hideInstallBanner);

    // Show banner after a delay
    setTimeout(() => {
      showInstallBanner();
    }, 3000);
  }

  // Show install banner
  function showInstallBanner() {
    if (installBanner && !localStorage.getItem('pwa-install-dismissed')) {
      installBanner.classList.add('show');
    }
  }

  // Hide install banner
  function hideInstallBanner() {
    if (installBanner) {
      installBanner.classList.remove('show');
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
  }

  // Handle install button click
  async function handleInstallClick() {
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        hideInstallBanner();
        
        // Track successful installation
        if (typeof gtag !== 'undefined') {
          gtag('event', 'pwa_install', {
            event_category: 'engagement',
            event_label: 'install_prompt'
          });
        }
      } else {
        console.log('User dismissed the install prompt');
      }

      // Clear the deferred prompt
      deferredPrompt = null;
      
    } catch (error) {
      console.error('Installation failed:', error);
    }
  }

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA install prompt available');
    
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Create and show install banner
    createInstallBanner();
  });

  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    
    // Hide install banner
    hideInstallBanner();
    
    // Track installation
    if (typeof gtag !== 'undefined') {
      gtag('event', 'pwa_install', {
        event_category: 'engagement',
        event_label: 'app_installed'
      });
    }
    
    // Show success message
    showInstallSuccess();
  });

  // Show installation success message
  function showInstallSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'pwa-success-message';
    successMessage.innerHTML = `
      <div class="pwa-success-content">
        <span>✅ ติดตั้งสำเร็จ! ShrimpSense ถูกเพิ่มลงหน้าจอหลักแล้ว</span>
        <button class="pwa-success-close">×</button>
      </div>
    `;

    // Add success message styles
    const style = document.createElement('style');
    style.textContent = `
      .pwa-success-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
      }
      
      .pwa-success-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .pwa-success-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s;
      }
      
      .pwa-success-close:hover {
        background: rgba(255,255,255,0.2);
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(successMessage);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.remove();
      }
    }, 5000);

    // Close button functionality
    const closeBtn = successMessage.querySelector('.pwa-success-close');
    closeBtn.addEventListener('click', () => {
      successMessage.remove();
    });
  }

  // Check if PWA is already installed
  function checkIfPWAInstalled() {
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.navigator.standalone === true) {
      console.log('PWA is already installed');
      return true;
    }
    return false;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('PWA Installation Script initialized');
    
    // Don't show install banner if PWA is already installed
    if (checkIfPWAInstalled()) {
      return;
    }
    
    // Check if user has dismissed the banner before
    if (!localStorage.getItem('pwa-install-dismissed')) {
      // Create banner after a delay
      setTimeout(createInstallBanner, 5000);
    }
  }

})();
