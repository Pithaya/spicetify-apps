import { LocalTracksService } from '../services/local-tracks-service';

declare global {
    interface Window {
        localTracksService: LocalTracksService;
    }
}
