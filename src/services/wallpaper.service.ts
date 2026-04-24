const BING_WALLPAPER_URL = 'https://raw.githubusercontent.com/v5tech/bing-wallpaper/main/bing-wallpaper.md';
const STORAGE_KEY = 'bing_wallpapers_cache';

export async function getRandomBingWallpaper(): Promise<string | null> {
  try {
    let wallpapers = getCachedWallpapers();

    if (!wallpapers) {
      const response = await fetch(BING_WALLPAPER_URL);
      if (!response.ok) throw new Error(`Failed to fetch wallpaper list: ${response.status}`);
      const text = await response.text();
      
      // Broader regex to catch different Bing domains and UHD suffixes
      const regex = /https:\/\/[a-z0-9\.]+\.bing\.com\/th\?id=OHR\.[^)]+\.jpg/g;
      const matches = text.match(regex);
      wallpapers = matches ? Array.from(new Set(matches)) : [];

      if (wallpapers.length > 0) {
        setCachedWallpapers(wallpapers);
      }
    }

    if (wallpapers.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * wallpapers.length);
    return wallpapers[randomIndex];
  } catch (error) {
    console.error('Error fetching Bing wallpaper:', error);
    return null;
  }
}

function getCachedWallpapers(): string[] | null {
  try {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function setCachedWallpapers(wallpapers: string[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(wallpapers));
  } catch (e) {
    // Session storage might be full or unavailable
  }
}
