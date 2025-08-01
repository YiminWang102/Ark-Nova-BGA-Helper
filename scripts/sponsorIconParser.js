import { sponsorsToTrack } from "./cardsToTrack";
import { getAllPlayedSponsors } from "./boardChecker";

export function parseSponsorIcons() {
    let sponsorIcons = [];

    const sponsors = getAllPlayedSponsors();
    sponsors.forEach(sponsor => {
        if (sponsor in sponsorsToTrack) {
            sponsorIcons = [...sponsorIcons, ...sponsorsToTrack[sponsor]];
        }
    });
    
    return sponsorIcons;
}