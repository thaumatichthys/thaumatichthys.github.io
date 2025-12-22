async function setUpThumbnails() {
    const link_grid = document.querySelector(".link-grid");
    const link_elements = Array.from(link_grid.children);

    for (const element of link_elements) {
        const link = element.querySelector("a").href;
        const image = element.querySelector("img");
        if (!image) continue;

        const extensions = ["jpg", "png", "webp"];
        const thumbnail_name = "thumbnail";
        const thumbnail_path = await findExistingImage(link, thumbnail_name, extensions);

        if (thumbnail_path) {
            // If <picture> exists, clear <source> srcset that would override <img src>
            const picture = image.closest("picture");
            if (picture) {
                picture.querySelectorAll("source").forEach(s => s.removeAttribute("srcset"));
            }

            image.src = thumbnail_path;
            image.removeAttribute("srcset");
            image.removeAttribute("sizes");
            image.dataset.src = thumbnail_path; // in case a lazy loader exists

            console.log("replaced:", image.currentSrc);
        }
    }
}

async function findExistingImage(baseLink, filenameNoExt, extensions) {
    const base = new URL(".", baseLink);

    for (const ext of extensions) {
        const candidate = new URL(`${filenameNoExt}.${ext}`, base).href;
        const ok = await imageExists(candidate);
        if (ok) return candidate;
    }
    return null;
}

function imageExists(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setUpThumbnails();
});
