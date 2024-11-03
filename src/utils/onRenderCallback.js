export const onRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
  interactions
) => {
  const performanceData = {
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    timestamp: new Date().toISOString(),
  };

  const existingData = JSON.parse(localStorage.getItem('profilerData') || '[]');
  existingData.push(performanceData);
  if (existingData.length > 100) {
    existingData.shift();
  }
  localStorage.setItem('profilerData', JSON.stringify(existingData));
  if (process.env.NODE_ENV === 'development') {
    console.group('Profiler Data:');
    console.log(`Component: ${id}`);
    console.log(`Phase: ${phase}`);
    console.log(`Actual duration: ${actualDuration.toFixed(2)}ms`);
    console.log(`Base duration: ${baseDuration.toFixed(2)}ms`);
    console.log(`Commit time: ${commitTime}`);
    console.groupEnd();
  }
};
