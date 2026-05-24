/**
 * Browser media permission utilities for the chat module.
 * Handles camera, microphone, and screen sharing permissions.
 */

export type PermissionType = "camera" | "microphone" | "screen";

export interface PermissionState {
  camera: boolean;
  microphone: boolean;
  screen: boolean;
}

/**
 * Check if a specific media permission is granted.
 */
export async function checkPermission(
  type: PermissionType,
): Promise<boolean> {
  try {
    if (type === "screen") {
      // Screen sharing doesn't have a persistent permission
      return true;
    }

    const permName = type === "camera" ? "camera" : "microphone";
    const result = await navigator.permissions.query({
      name: permName as PermissionName,
    });
    return result.state === "granted";
  } catch {
    // Fallback: try to enumerate devices
    return false;
  }
}

/**
 * Request media permission by attempting to access the device.
 * Returns true if permission was granted, false otherwise.
 */
export async function requestPermission(
  type: PermissionType,
): Promise<boolean> {
  try {
    if (type === "screen") {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      stream.getTracks().forEach((t) => t.stop());
      return true;
    }

    const constraints: MediaStreamConstraints = {
      audio: type === "microphone" || type === "camera",
      video: type === "camera",
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

/**
 * Check all media permissions at once.
 */
export async function checkAllPermissions(): Promise<PermissionState> {
  const [camera, microphone] = await Promise.all([
    checkPermission("camera"),
    checkPermission("microphone"),
  ]);

  return { camera, microphone, screen: true };
}

/**
 * Check if the device has a specific media device available.
 */
export async function hasDevice(
  kind: "videoinput" | "audioinput" | "audiooutput",
): Promise<boolean> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((d) => d.kind === kind);
  } catch {
    return false;
  }
}

/**
 * Check if the device has multiple cameras (for flip camera feature).
 */
export async function hasMultipleCameras(): Promise<boolean> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((d) => d.kind === "videoinput").length > 1;
  } catch {
    return false;
  }
}
