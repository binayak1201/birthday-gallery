// Native fetch is available in Node.js 18+
require('dotenv').config({ path: '.env.local' });

async function testPhotoEffects() {
  try {
    // 1. First, let's get a list of photos
    console.log('1. Fetching photos...');
    const photosResponse = await fetch('http://localhost:3000/api/photos');
    const photos = await photosResponse.json();

    if (!photos.resources || photos.resources.length === 0) {
      console.log('No photos found. Please upload some photos first.');
      return;
    }

    const testPhoto = photos.resources[0];
    console.log(`Found photo: ${testPhoto.public_id}`);

    // 2. Test applying different effects
    const effects = [
      {
        name: 'Vintage',
        settings: { filter: 'Vintage', brightness: 90, contrast: 110 }
      },
      {
        name: 'B&W',
        settings: { filter: 'B&W', brightness: 100, contrast: 120 }
      },
      {
        name: 'Vivid',
        settings: { filter: 'Vivid', brightness: 110, contrast: 110 }
      }
    ];

    console.log('\n2. Testing photo effects...');
    for (const effect of effects) {
      console.log(`\nApplying ${effect.name} effect...`);
      const effectResponse = await fetch(
        `http://localhost:3000/api/photos/${testPhoto.public_id}/effects`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(effect.settings),
        }
      );

      if (!effectResponse.ok) {
        throw new Error(`Failed to apply effect: ${effectResponse.statusText}`);
      }

      const result = await effectResponse.json();
      console.log(`Effect applied: ${JSON.stringify(result.effects, null, 2)}`);
    }

    console.log('\nPhoto effects test completed successfully! ✨');
    console.log('\nTo try the effects in the UI:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Click "Our Memories" to enter the gallery');
    console.log('3. Click any photo to view it');
    console.log('4. Click the effects button (slider icon) in the bottom-right');
    console.log('5. Try different filters and adjustments');

  } catch (error) {
    console.error('Error testing photo effects:', error.message);
  }
}

// Start the test
console.log('Starting photo effects test...\n');
testPhotoEffects();
