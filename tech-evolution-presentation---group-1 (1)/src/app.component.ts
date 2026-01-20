import { Component, signal, computed, ViewChild, ElementRef, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Member {
  name: string;
  avatar: string;
  // CSS variables for chaos animation
  style: {
    '--tx': string;
    '--ty': string;
    '--tr': string;
  };
}

interface SlideContent {
  id: number;
  type: 'cover' | 'members' | 'content' | 'video' | 'thankyou';
  title?: string;
  body?: string; // HTML allowed for rich text
  image?: string;
  video?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  host: {
    '(window:keydown)': 'handleKeyboardEvent($event)'
  }
})
export class AppComponent implements OnDestroy {
  // --- State ---
  currentSlideIndex = signal(0);
  
  // Typewriter state
  displayedTitle = signal('');
  isTyping = signal(false);
  
  // --- Data ---
  teamMembers: Member[] = []; // Initialized in constructor

  slides: SlideContent[] = [
    {
      id: 0,
      type: 'cover',
      title: 'CHÀO MỪNG ĐẾN VỚI BÀI THUYẾT TRÌNH CỦA TỔ 1',
      body: 'SỰ PHÁT TRIỂN CỦA CÔNG NGHỆ THÔNG TIN'
    },
    {
      id: 1,
      type: 'members',
      title: 'THÀNH VIÊN TỔ 1'
    },
    {
      id: 2,
      type: 'content',
      title: '1. Kỷ Nguyên Máy Tính Sơ Khai',
      body: 'Trước khi có những chiếc smartphone nhỏ gọn, máy tính là những cỗ máy khổng lồ. ENIAC (1945) là máy tính điện tử đa năng đầu tiên, chiếm diện tích cả một căn phòng và nặng hàng chục tấn. Giai đoạn này đánh dấu bước chuyển mình từ tính toán cơ học sang tính toán điện tử, đặt nền móng cho logic nhị phân (0 và 1) mà chúng ta sử dụng ngày nay.',
      image: 'https://topdev.vn/blog/wp-content/uploads/2023/07/cong-nghe-thong-tin-1.jpg'
    },
    {
      id: 3,
      type: 'content',
      title: '2. Sự Ra Đời Của Transistor & Vi Mạch',
      body: 'Cuộc cách mạng thực sự bắt đầu với việc phát minh ra Transistor (Bóng bán dẫn) vào năm 1947, thay thế cho bóng đèn chân không cồng kềnh. Sau đó, mạch tích hợp (IC) ra đời, cho phép nén hàng triệu linh kiện vào một con chip nhỏ xíu. Định luật Moore ra đời, dự đoán sức mạnh tính toán sẽ tăng gấp đôi mỗi 2 năm, thúc đẩy tốc độ phát triển chóng mặt của phần cứng.',
      image: 'https://it.ctim.edu.vn/uploads/images/T7_2023/084112_Viec_lam_nganh_CNTT_-_Hinh_3.jpg'
    },
    {
      id: 4,
      type: 'content',
      title: '3. Máy Tính Cá Nhân (PC) Phổ Cập',
      body: 'Những năm 1970-1980 chứng kiến sự xuất hiện của Apple II, IBM PC và hệ điều hành Windows. Máy tính không còn là đặc quyền của các phòng thí nghiệm mà đã đi vào từng gia đình và văn phòng. Giao diện đồ họa (GUI) và chuột máy tính đã thay đổi hoàn toàn cách con người tương tác với máy móc, biến công nghệ trở nên thân thiện và dễ tiếp cận hơn.',
      image: 'https://funix.edu.vn/wp-content/uploads/2023/01/cong-nghe-thong-tin-co-de-hoc.jpg'
    },
    {
      id: 5,
      type: 'content',
      title: '4. Kỷ Nguyên Internet & World Wide Web',
      body: 'Những năm 1990, mạng Internet bùng nổ, kết nối toàn cầu. World Wide Web (WWW) do Tim Berners-Lee phát minh đã mở ra kho tàng tri thức vô tận. Email, công cụ tìm kiếm (Google), và thương mại điện tử (Amazon) bắt đầu định hình lại nền kinh tế và xã hội thế giới. Thế giới trở nên "phẳng" hơn bao giờ hết.',
      image: 'https://blog.topcv.vn/wp-content/uploads/2020/09/cong-nghe-thong-tin-la-gi-tn.jpg'
    },
    {
      id: 6,
      type: 'content',
      title: '5. Di Động Hóa & Điện Toán Đám Mây',
      body: 'Sự ra mắt của iPhone (2007) đã mở ra kỷ nguyên smartphone. Máy tính giờ đây nằm gọn trong túi quần. Cùng với đó, Điện toán đám mây (Cloud Computing) cho phép lưu trữ và xử lý dữ liệu mọi lúc mọi nơi mà không cần phần cứng mạnh mẽ tại chỗ. Các ứng dụng mạng xã hội (Facebook, TikTok) thay đổi cách con người giao tiếp.',
      image: 'https://yersin.edu.vn/wp-content/uploads/2024/06/kho-khan-cua-nganh-cong-nghe-thong-tin-1.jpg'
    },
    {
      id: 7,
      type: 'content',
      title: '6. Trí Tuệ Nhân Tạo (AI) & Tương Lai',
      body: 'Chúng ta đang sống trong kỷ nguyên bùng nổ của AI. Từ Machine Learning, Big Data đến Generative AI (như ChatGPT, Gemini). Máy tính không chỉ tính toán mà còn có thể "học", "sáng tạo" và hỗ trợ ra quyết định. Tương lai hứa hẹn sự kết hợp giữa con người và máy móc, Internet vạn vật (IoT) và những đột phá chưa từng có trong y tế, giáo dục và đời sống.',
      image: 'https://static.cand.com.vn/Files/Image/anbinh/2020/12/31/2b479c56-79af-4ec0-ab48-acead63d3d87.jpg'
    },
    {
      id: 8,
      type: 'video',
      title: 'Video Minh Họa',
      video: 'https://res.cloudinary.com/djzuxbjor/video/upload/v1768920459/Video_style__202601202140_zsicl_hlz3qd.mp4'
    },
    {
      id: 9,
      type: 'thankyou',
      title: 'CẢM ƠN',
      body: 'Cảm ơn thầy cô và các bạn đã lắng nghe!'
    }
  ];

  // --- Computed ---
  isFirstSlide = computed(() => this.currentSlideIndex() === 0);
  isLastSlide = computed(() => this.currentSlideIndex() === this.slides.length - 1);
  progressWidth = computed(() => ((this.currentSlideIndex() + 1) / this.slides.length) * 100 + '%');
  sliderTransform = computed(() => `translateX(-${this.currentSlideIndex() * 100}%)`);

  // --- Visual Effects ---
  @ViewChild('explosionCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationFrameId: number | null = null;
  private typingTimeout: any;

  constructor() {
    this.initMembers();

    // Effect to handle Slide Transitions & Animations
    effect(() => {
      const index = this.currentSlideIndex();
      
      // 1. Handle Typewriter for Cover (Slide 0)
      if (index === 0) {
        this.startTypewriter(this.slides[0].body || '');
      } else {
        // Reset typing if we leave slide 0, so it types again when we come back
        this.displayedTitle.set(''); 
        this.isTyping.set(false);
        clearTimeout(this.typingTimeout);
      }

      // 2. Handle Thank You particles (Last Slide)
      if (index === this.slides.length - 1) {
        setTimeout(() => this.startExplosion(), 100);
      } else {
        this.stopExplosion();
      }
    });
  }

  // Generate random starting positions for the "Chaos Fly In" effect
  initMembers() {
    const rawMembers = [
      { name: 'Ngọc Hân', avatar: 'https://picsum.photos/seed/han/100/100' },
      { name: 'Khánh Ngọc', avatar: 'https://picsum.photos/seed/kngoc/100/100' },
      { name: 'N. Quỳnh Anh', avatar: 'https://picsum.photos/seed/qanh/100/100' },
      { name: 'Vân Xuyến', avatar: 'https://picsum.photos/seed/xuyen/100/100' },
      { name: 'Mạnh Khôi', avatar: 'https://picsum.photos/seed/khoi/100/100' },
      { name: 'Tuệ Phong', avatar: 'https://picsum.photos/seed/phong/100/100' },
      { name: 'Hà Anh', avatar: 'https://picsum.photos/seed/haanh/100/100' },
      { name: 'Minh Hiền', avatar: 'https://picsum.photos/seed/hien/100/100' },
      { name: 'Hà Chi', avatar: 'https://picsum.photos/seed/chi/100/100' },
    ];

    this.teamMembers = rawMembers.map(m => ({
      ...m,
      style: {
        '--tx': `${(Math.random() * 200 - 100)}vw`, // Random X between -100vw and 100vw
        '--ty': `${(Math.random() * 200 - 100)}vh`, // Random Y between -100vh and 100vh
        '--tr': `${Math.random() * 720 - 360}deg`    // Random Rotation
      }
    }));
  }

  // --- Typewriter Logic ---
  startTypewriter(text: string) {
    this.displayedTitle.set('');
    this.isTyping.set(true);
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        this.displayedTitle.update(current => current + text.charAt(i));
        i++;
        // Slower typing speed (100ms) as requested
        this.typingTimeout = setTimeout(type, 100); 
      } else {
        this.isTyping.set(false);
      }
    };
    
    // Initial delay to let the blur animation start first
    this.typingTimeout = setTimeout(type, 1000);
  }

  // --- Methods ---
  next() {
    if (!this.isLastSlide()) {
      this.currentSlideIndex.update(v => v + 1);
    }
  }

  prev() {
    if (!this.isFirstSlide()) {
      this.currentSlideIndex.update(v => v - 1);
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this.slides.length) {
      this.currentSlideIndex.set(index);
    }
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight' || event.key === ' ') {
      this.next();
    } else if (event.key === 'ArrowLeft') {
      this.prev();
    }
  }

  // --- Particle Engine ---
  startExplosion() {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    this.particles = [];
    this.createParticles(canvas.width / 2, canvas.height / 2, 80);
    
    this.stopExplosion();
    this.loop();
  }

  createParticles(x: number, y: number, count: number) {
     for(let i=0; i<count; i++) {
        this.particles.push(new Particle(x, y));
     }
  }

  loop() {
     if (!this.ctx || !this.canvasRef) return;
     const canvas = this.canvasRef.nativeElement;
     
     this.ctx.globalCompositeOperation = 'destination-out';
     this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
     this.ctx.fillRect(0, 0, canvas.width, canvas.height);
     this.ctx.globalCompositeOperation = 'lighter';

     for (let i = this.particles.length - 1; i >= 0; i--) {
       const p = this.particles[i];
       p.update();
       p.draw(this.ctx);
       if (p.life <= 0) {
         this.particles.splice(i, 1);
       }
     }

     if (Math.random() < 0.03) {
         const randomX = Math.random() * canvas.width;
         const randomY = Math.random() * (canvas.height * 0.6);
         this.createParticles(randomX, randomY, 40);
     }

     this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  stopExplosion() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  ngOnDestroy() {
    this.stopExplosion();
    clearTimeout(this.typingTimeout);
  }
}

class Particle {
   x: number;
   y: number;
   vx: number;
   vy: number;
   life: number;
   color: string;
   size: number;
   
   constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2; 
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.life = 100;
      this.size = Math.random() * 3 + 1;
      
      const colors = ['#00f3ff', '#bc13fe', '#0aff0a', '#ffffff', '#ff0055'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
   }
   
   update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.1;
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.life -= 1.5;
   }
   
   draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
   }
}