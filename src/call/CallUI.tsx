import { Mic, MicOff, PhoneOff, Phone } from "lucide-react";

export function MuteMic({ mute }: { mute: () => void }) {
  return (
    <button
      onClick={mute}
      className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
    >
      <MicOff className="w-5 h-5 text-gray-600" />
    </button>
  );
}

export function UnMuteMic({ unMute }: { unMute: () => void }) {
  return (
    <button
      onClick={unMute}
      className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
    >
      <Mic className="w-5 h-5 text-gray-600" />
    </button>
  );
}

export function EndCallButton({ onEnd }: { onEnd: () => void }) {
  return (
    <button
      onClick={onEnd}
      className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
    >
      <PhoneOff className="w-5 h-5 text-white" />
    </button>
  );
}

export function AcceptCallButton({ onAccept }: { onAccept: () => void }) {
  return (
    <button
      onClick={onAccept}
      className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer"
    >
      <Phone className="w-5 h-5 text-white" />
    </button>
  );
}
