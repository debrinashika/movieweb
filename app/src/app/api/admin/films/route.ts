import { NextRequest, NextResponse } from 'next/server';
import { getAllFilms, getAllTitleDirector, createFilm} from '../../../../controllers/filmController';
import { getUserFromToken } from '../../../../controllers/userController';
import { adminMiddleware } from '../../../../middlewares/adminMiddleware';
import { setCORSHeaders } from '../../../lib/cors';
import { v4 as uuidv4 } from 'uuid';
import { bucket } from '../../../../bucket/firebase';
import { Readable } from 'stream';

export async function OPTIONS(request: NextRequest) {
  return setCORSHeaders(new NextResponse(null, { status: 204 }), 'https://labpro-fe.hmif.dev');
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const authResult = adminMiddleware(token);

    if (!authResult.isAuthorized) {
      return setCORSHeaders(
        NextResponse.json({ status: 'error', message: authResult.message }, { status: authResult.status }),
        'https://labpro-fe.hmif.dev'
      );
    }

    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    if (query) {
      return setCORSHeaders(await getAllTitleDirector(query), 'https://labpro-fe.hmif.dev');
    }

    return setCORSHeaders(await getAllFilms(), 'https://labpro-fe.hmif.dev');

  } catch (error) {
    return setCORSHeaders(
      NextResponse.json({ status: 'error', message: 'Failed to process request.' }, { status: 500 }),
      'https://labpro-fe.hmif.dev'
    );
  }
}

async function uploadFileToFirebase(file: Blob, folder: string): Promise<string> {
    try {
      console.log('Starting upload...');
      const fileName = `${folder}/${uuidv4()}_${(file as any).name}`;
      console.log('Generated file name:', fileName);
  
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
  
      const fileUpload = bucket.file(fileName);
  
      console.log('Uploading to Firebase...');
      const stream = Readable.from(buffer);
  
      await new Promise((resolve, reject) => {
        stream.pipe(
          fileUpload.createWriteStream({
            metadata: {
              contentType: file.type,
            },
          })
        )
        .on('finish', resolve)
        .on('error', reject);
      });
  
      await fileUpload.makePublic();
      console.log('Upload successful:', fileName);
      return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('Failed to upload file to Firebase');
    }
  }


  export async function POST(request: NextRequest) {
    try {
      const token = request.headers.get('Authorization')?.split(' ')[1];
      const authResult = adminMiddleware(token);
  
      if (!authResult.isAuthorized) {
        return setCORSHeaders(
          NextResponse.json({ status: 'error', message: authResult.message }, { status: authResult.status }),
          'https://labpro-fe.hmif.dev'
        );
      }

      if (!token) {
        return setCORSHeaders(
          NextResponse.json({ status: 'error', message: authResult.message }, { status: authResult.status }),
          'https://labpro-fe.hmif.dev'
        );
      }
  
    const userData = await getUserFromToken(token);
    if (!userData) {
      return setCORSHeaders(NextResponse.json({ status: 'error', message: 'Unauthorized.' }), 'https://labpro-fe.hmif.dev');
    }
 

      const formData = await request.formData();
      const title = formData.get('title');
      const description = formData.get('description');
      const director = formData.get('director');
      const release_year = parseInt(formData.get('release_year') as string, 10);
      const genre = (formData.getAll('genre') as string[]).map((g) => g.trim());
      const price = parseFloat(formData.get('price') as string);
      const duration = parseInt(formData.get('duration') as string, 10);
  
      const video = formData.get('video') as Blob;
      const coverImage = formData.get('cover_image') as Blob | null;
  
      console.log('ccc')
      const videoUrl = await uploadFileToFirebase(video, 'videos');
      const coverImageUrl = coverImage ? await uploadFileToFirebase(coverImage, 'images') : null;
  
      console.log('bbb')
      const filmData = {
        title: title as string,
        description: description as string,
        director: director as string,
        release_year,
        genre,
        price,
        duration,
        video_url: videoUrl,
        cover_image_url: coverImageUrl,
      };
      console.log(filmData)
      
        const createdFilm = await createFilm(filmData,userData);
        console.log('asaaa')
        return setCORSHeaders(
          NextResponse.json({ status: 'success', message: 'Film created successfully.', data: createdFilm }),
          'https://labpro-fe.hmif.dev'
        );
      
      
    } catch (error) {
      return setCORSHeaders(
        NextResponse.json({ status: 'error', message: 'Failed to create film.' }, { status: 500 }),
        'https://labpro-fe.hmif.dev'
      );
    }
  }