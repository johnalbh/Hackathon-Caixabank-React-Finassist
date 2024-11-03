export const atom = (initialValue) => ({
  get: () => initialValue,
  set: jest.fn(),
  subscribe: jest.fn(),
});

export const useStore = jest.fn();
