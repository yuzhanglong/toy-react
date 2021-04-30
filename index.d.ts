interface IdleDeadline {
  timeRemaining(): DOMHighResTimeStamp;
  readonly didTimeout: boolean;
}

interface IdleRequestOptions {
  timeout: number;
}

type IdleCallbackHandle = number;

type IdleRequestCallback = (deadline: IdleDeadline) => void;

interface Window {
  requestIdleCallback(callback: IdleRequestCallback, options?: IdleRequestOptions): IdleCallbackHandle;
  cancelIdleCallback(handle: number): void;
}

declare function requestIdleCallback(callback: IdleRequestCallback, options?: IdleRequestOptions): number;
declare function cancelIdleCallback(handle: number): void;

declare function request(callback: IdleRequestCallback, options?: IdleRequestOptions): IdleCallbackHandle;
declare function cancel(handle: IdleCallbackHandle): void;
