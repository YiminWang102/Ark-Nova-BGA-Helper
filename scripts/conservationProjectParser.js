export function parseConservationProjects() {
    const conservationProjects = [];
  
    // Parse base projects
    const baseProjectElements = document.querySelectorAll('#base-projects-holder .project-holder');
    baseProjectElements.forEach((project) => {
        const badge = project.querySelector('.badge-icon');
        if (badge) {
            const projectType = badge.getAttribute('data-type');
            
            if (projectType) {
                conservationProjects.push({ type: 'BASE', projectType });
            }
        }
    });

    function parseNonBaseProject(project) {
        const badge = project.querySelector('.badge-icon');
        const pzooIcon = project.querySelector('.icon-partner-zoo');
        const releaseIcon = project.querySelector('.icon-release-animal');

        if (badge) {
            const projectType = badge.getAttribute('data-type');
            
            if (projectType) {
                if (pzooIcon) {
                    conservationProjects.push({ type: 'PROG', projectType });
                }

                if (releaseIcon) {
                    conservationProjects.push({ type: 'RELEASE', projectType });
                }
            }
        }
    }

    // Parse project holder
    const activeProjects = document.querySelectorAll('#projects-holder .project-holder');
    activeProjects.forEach(parseNonBaseProject);

    // Parse hand and display for projects
    const displayProjectCards = document.querySelectorAll('#cards-pool .project-card');
    displayProjectCards.forEach(parseNonBaseProject);

    const handProjectCards = document.querySelectorAll('.player-board-hand .project-card');
    handProjectCards.forEach(parseNonBaseProject);

    return conservationProjects;
}