import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles (with proper TypeScript handling)
import 'swiper/swiper-bundle.css';

// Styled components
import styled from 'styled-components';

interface CarouselProps {
  images?: string[];
  autoplay?: boolean;
  showNavigation?: boolean;
  showPagination?: boolean;
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow';
  slidesPerView?: number;
  spaceBetween?: number;
  loop?: boolean;
  delay?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  images = [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=400&fit=crop'
  ],
  autoplay = true,
  showNavigation = true,
  showPagination = true,
  effect = 'slide',
  slidesPerView = 1,
  spaceBetween = 30,
  loop = true,
  delay = 3000
}) => {
  // Railway-themed default images if none provided
  const defaultRailwayImages = [
    'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=400&fit=crop'
  ];

  const carouselImages = images.length > 0 ? images : defaultRailwayImages;

  return (
    <CarouselContainer>
      <StyledSwiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        navigation={showNavigation}
        pagination={showPagination ? { clickable: true, dynamicBullets: true } : false}
        autoplay={autoplay ? {
          delay: delay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        } : false}
        loop={loop}
        effect={effect}
        fadeEffect={{ crossFade: true }}
        grabCursor={true}
        className="railway-carousel"
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          640: {
            slidesPerView: slidesPerView > 1 ? Math.min(slidesPerView, 2) : 1,
            spaceBetween: 20
          },
          768: {
            slidesPerView: slidesPerView > 2 ? Math.min(slidesPerView, 3) : slidesPerView,
            spaceBetween: spaceBetween
          },
          1024: {
            slidesPerView: slidesPerView,
            spaceBetween: spaceBetween
          }
        }}
      >
        {carouselImages.map((image, index) => (
          <SwiperSlide key={index}>
            <SlideContainer>
              <SlideImage
                src={image}
                alt={`Railway slide ${index + 1}`}
                loading={index === 0 ? 'eager' : 'lazy'}
                onError={(e) => {
                  // Fallback image on error
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/800x400/4338ca/ffffff?text=Railway+Image+${index + 1}`;
                }}
              />
              <SlideOverlay>
                <SlideContent>
                  <SlideTitle>
                    {index === 0 && "🚄 Modern Railway Experience"}
                    {index === 1 && "🎫 Easy Online Booking"}
                    {index === 2 && "🌟 Comfortable Journey"}
                    {index === 3 && "⚡ Fast & Reliable Service"}
                  </SlideTitle>
                  <SlideDescription>
                    {index === 0 && "Experience the future of railway travel with our modern fleet"}
                    {index === 1 && "Book your tickets seamlessly with our advanced booking system"}
                    {index === 2 && "Enjoy comfortable seating and premium amenities"}
                    {index === 3 && "Punctual, safe, and efficient transportation services"}
                  </SlideDescription>
                </SlideContent>
              </SlideOverlay>
            </SlideContainer>
          </SwiperSlide>
        ))}
      </StyledSwiper>
      
      {/* Progress bar */}
      {autoplay && (
        <ProgressBar>
          <ProgressIndicator />
        </ProgressBar>
      )}
    </CarouselContainer>
  );
};

// Styled Components
const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  @media (max-width: 768px) {
    height: 300px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    height: 250px;
    border-radius: 8px;
  }
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: 100%;
  
  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .swiper-button-next,
  .swiper-button-prev {
    color: white;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    width: 44px;
    height: 44px;
    margin-top: -22px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(0, 0, 0, 0.5);
      transform: scale(1.1);
    }
    
    &:after {
      font-size: 16px;
      font-weight: bold;
    }
    
    @media (max-width: 768px) {
      width: 36px;
      height: 36px;
      margin-top: -18px;
      
      &:after {
        font-size: 14px;
      }
    }
  }
  
  .swiper-pagination {
    bottom: 16px;
    
    .swiper-pagination-bullet {
      background: rgba(255, 255, 255, 0.5);
      border: 2px solid white;
      width: 12px;
      height: 12px;
      margin: 0 6px;
      transition: all 0.3s ease;
      
      &.swiper-pagination-bullet-active {
        background: white;
        transform: scale(1.2);
      }
    }
    
    @media (max-width: 768px) {
      bottom: 12px;
      
      .swiper-pagination-bullet {
        width: 8px;
        height: 8px;
        margin: 0 4px;
      }
    }
  }
`;

const SlideContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const SlideOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 30%,
    rgba(0, 0, 0, 0.6) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 32px;
  
  @media (max-width: 768px) {
    padding: 24px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const SlideContent = styled.div`
  color: white;
  max-width: 500px;
`;

const SlideTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 6px;
  }
`;

const SlideDescription = styled.p`
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.95;
  line-height: 1.5;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
`;

const ProgressIndicator = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  width: 0%;
  animation: progress 3s linear infinite;
  
  @keyframes progress {
    0% { width: 0%; }
    100% { width: 100%; }
  }
`;

// Alternative simpler version without styled-components
export const SimpleCarousel: React.FC<CarouselProps> = ({
  images = [],
  autoplay = true,
  showNavigation = true,
  showPagination = true,
  slidesPerView = 1,
  spaceBetween = 30,
  loop = true,
  delay = 3000
}) => {
  const defaultImages = [
    'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=400&fit=crop'
  ];

  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-500 to-purple-600">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        navigation={showNavigation}
        pagination={showPagination ? { clickable: true } : false}
        autoplay={autoplay ? { delay, disableOnInteraction: false } : false}
        loop={loop}
        className="w-full h-full"
      >
        {(images.length > 0 ? images : defaultImages).map((image, index) => (
          <SwiperSlide key={index} className="relative">
            <div className="w-full h-full relative">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  Railway Service {index + 1}
                </h3>
                <p className="text-lg opacity-90">
                  Experience premium railway travel
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;