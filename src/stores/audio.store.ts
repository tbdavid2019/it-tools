import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';

export type EffectType = 'fadeIn' | 'fadeOut' | 'echo' | 'reverb';

export interface AudioEffect {
    id: string;
    type: EffectType;
    value: number;
    timestamp: number;
}

export interface AudioSelection {
    start: number;
    end: number;
}

export const useAudioStore = defineStore('audio', () => {
    const audioFile = ref<File | null>(null);
    const audioBuffer = shallowRef<AudioBuffer | null>(null);
    const isPlaying = ref(false);
    const volume = ref(1);
    const duration = ref(0);
    const currentTime = ref(0);
    const speed = ref(1);
    const selection = ref<AudioSelection>({ start: 0, end: 0 });
    const effects = ref<AudioEffect[]>([]);

    const setAudioFile = (file: File | null) => {
        audioFile.value = file;
    };

    const setAudioBuffer = (buffer: AudioBuffer | null) => {
        audioBuffer.value = buffer;
    };

    const setIsPlaying = (playing: boolean) => {
        isPlaying.value = playing;
    };

    const setVolume = (vol: number) => {
        volume.value = vol;
    };

    const setDuration = (dur: number) => {
        duration.value = dur;
    };

    const setCurrentTime = (time: number) => {
        currentTime.value = time;
    };

    const setSpeed = (s: number) => {
        speed.value = s;
    };

    const setSelection = (sel: AudioSelection) => {
        selection.value = sel;
    };

    const addEffect = (effect: Omit<AudioEffect, 'id' | 'timestamp'>) => {
        effects.value.push({
            ...effect,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
        });
    };

    const removeEffect = (effectId: string) => {
        effects.value = effects.value.filter((effect) => effect.id !== effectId);
    };

    const reset = () => {
        audioFile.value = null;
        audioBuffer.value = null;
        isPlaying.value = false;
        volume.value = 1;
        duration.value = 0;
        currentTime.value = 0;
        speed.value = 1;
        selection.value = { start: 0, end: 0 };
        effects.value = [];
    };

    return {
        audioFile,
        audioBuffer,
        isPlaying,
        volume,
        duration,
        currentTime,
        speed,
        selection,
        effects,
        setAudioFile,
        setAudioBuffer,
        setIsPlaying,
        setVolume,
        setDuration,
        setCurrentTime,
        setSpeed,
        setSelection,
        addEffect,
        removeEffect,
        reset,
    };
});
