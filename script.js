function findRoots(ele) {
  const shadowRoots = [
    ele,
    ...ele.querySelectorAll('*')
  ].filter(e => !!e.shadowRoot)
    .flatMap(e => [e.shadowRoot, ...findRoots(e.shadowRoot)])
  return [...shadowRoots, document]
}

function findLargestPlayingVideo() {
  const roots = findRoots(document);
  const videos = roots.flatMap(e => Array.from(e.querySelectorAll('video')).filter(video => video.readyState != 0));
  const video = videos
    .sort((v1, v2) => {
      const v1Rect = v1.getClientRects()[0] || { width: 0, height: 0 };
      const v2Rect = v2.getClientRects()[0] || { width: 0, height: 0 };
      return ((v2Rect.width * v2Rect.height) - (v1Rect.width * v1Rect.height));
    })[0];

  if (video == null) {
    return;
  }

  return video;
}

async function requestPictureInPicture(video) {
  video.removeAttribute('disablePictureInPicture');
  await video.requestPictureInPicture();
}

(async () => {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  } else {
    const video = findLargestPlayingVideo();
    if (!video) {
      return;
    }
    await requestPictureInPicture(video);
  }
})();
