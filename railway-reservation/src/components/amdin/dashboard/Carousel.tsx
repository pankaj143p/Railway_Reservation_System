import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
  { label: '1', imgPath: '/static/banner1.jpg' },
  { label: '2', imgPath: '/static/banner2.jpg' },
  { label: '3', imgPath: '/static/banner_3.jpg' },
  { label: '4', imgPath: '/static/banner_4.jpg' },
  { label: '5', imgPath: '/static/banner_5.jpg' },
];

function Carousel() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = React.useState(true);

  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev - 1 + maxSteps) % maxSteps);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoPlayEnabled(false);
  const handleMouseLeave = () => setAutoPlayEnabled(true);

  return (
    <Box
      sx={{ flexGrow: 1, position: 'relative', width: '100%', maxWidth: 990, mx: 'auto' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
        interval={1500}
        autoplay={autoPlayEnabled}
      >
        {images.map((step, index) => (
          <div key={step.label}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                component="img"
                sx={{
                  display: 'block',
                  width: '100%',
                  height: { xs: 180, sm: 300, md: 330 },
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 2,
                }}
                src={step.imgPath}
                alt={step.label}
              />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>

      {/* Prev Button */}
      <button
        onClick={handleBack}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
        aria-label="Previous"
        style={{ zIndex: 2 }}
      >
        &#8592;
      </button>
      {/* Next Button */}
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
        aria-label="Next"
        style={{ zIndex: 2 }}
      >
        &#8594;
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleStepChange(idx)}
            className={`w-3 h-3 rounded-full ${activeStep === idx ? 'bg-blue-600' : 'bg-gray-300'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Optional: Show label */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded text-sm">
        {images[activeStep].label}
      </div>
    </Box>
  );
}

export default Carousel;