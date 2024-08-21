import { NextRequest, NextResponse } from 'next/server';
import { updateFilm, deleteFilm, getfilmbyID } from '../../../../../controllers/filmController';
import { adminMiddleware } from '../../../../../middlewares/adminMiddleware';
import { setCORSHeaders } from '../../../../lib/cors';
import { v4 as uuidv4 } from 'uuid';
import { bucket } from '../../../../../bucket/firebase';
import { Readable } from 'stream';

export async function OPTIONS(request: NextRequest) {
  return setCORSHeaders(new NextResponse(null, { status: 204 }), 'https://labpro-fe.hmif.dev');
}

export async function DELETE(request: NextRequest) {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const id = new URL(request.url).pathname.split('/').pop();
  
    const authResult = adminMiddleware(token);
    if (!authResult.isAuthorized) {
      return setCORSHeaders(
        NextResponse.json({ status: 'error', message: authResult.message }, { status: authResult.status }),
        'https://labpro-fe.hmif.dev'
      );
    }
  
    if (!id) {
      return setCORSHeaders(
        NextResponse.json({ status: 'error', message: 'Invalid ID' }, { status: 400 }),
        'https://labpro-fe.hmif.dev'
      );
    }
  
    return setCORSHeaders(await deleteFilm(id), 'https://labpro-fe.hmif.dev');
  }
  

  export async function GET(request: NextRequest) {
    try {
      const token = request.headers.get('Authorization')?.split(' ')[1];
      const authResult = adminMiddleware(token);
      const id = new URL(request.url).pathname.split('/').pop();
  
      if (!authResult.isAuthorized) {
        return setCORSHeaders(
          NextResponse.json({ status: 'error', message: authResult.message }, { status: authResult.status }),
          'https://labpro-fe.hmif.dev'
        );
      }
  
  
      if (id) {
        return setCORSHeaders(await getfilmbyID(id), 'https://labpro-fe.hmif.dev');
      } 
  
      return setCORSHeaders(
        NextResponse.json({ status: 'error', message: 'Invalid request.' }, { status: 400 }),
        'https://labpro-fe.hmif.dev'
      );
    } catch (error) {
      return setCORSHeaders(
        NextResponse.json({ status: 'error', message: 'Failed to process request.' }, { status: 500 }),
        'https://labpro-fe.hmif.dev'
      );
    }
  }

  async function uploadFileToFirebase(file: Blob, folder: string): Promise<string> {
    try {
      const fileName = `${folder}/${uuidv4()}_${(file as any).name}`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
  
      const fileUpload = bucket.file(fileName);
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
  
      return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    } catch (error) {
      throw new Error('Failed to upload file to Firebase');
    }
  }
  
  export async function PUT(request: NextRequest) {
    try {
        const filmId = new URL(request.url).pathname.split('/').pop();

        if (!filmId) {
            return setCORSHeaders(
              NextResponse.json({ status: 'error', message: 'Film ID is required' }, { status: 400 }),
              'https://labpro-fe.hmif.dev'
            );
          }

        const token = request.headers.get('Authorization')?.split(' ')[1];
        const authResult = adminMiddleware(token);
    
        if (!authResult.isAuthorized) {
            return setCORSHeaders(
            NextResponse.json({ status: 'error', message: authResult.message }, { status: authResult.status }),
            'https://labpro-fe.hmif.dev'
            );
        }
    
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const director = formData.get('director') as string;
        const release_year = parseInt(formData.get('release_year') as string, 10);
        const genre = (formData.get('genre') as string).split(',');
        const price = parseFloat(formData.get('price') as string);
        const duration = parseInt(formData.get('duration') as string, 10);
        const video = formData.get('video') as Blob | null;
        const coverImage = formData.get('cover_image') as Blob | null;
    
        const response = await getfilmbyID(filmId);
        const existingFilm = await response.json(); 

        if (existingFilm.status != 'success') {
            return setCORSHeaders(
                NextResponse.json({ status: 'error', message: 'Failed to update film' }, { status: 500 }),
                'https://labpro-fe.hmif.dev'
            );
        } 

        let videoUrl = existingFilm.video_url;
        let coverImageUrl = existingFilm.cover_image_url;

    
        if (video) {
            videoUrl = await uploadFileToFirebase(video, 'videos');
        }
    
        if (coverImage) {
            coverImageUrl = await uploadFileToFirebase(coverImage, 'images');
        }
    
        const updatedFilmData = {
            title,
            description,
            director,
            release_year,
            genre,
            price,
            duration,
            video_url: videoUrl,
            cover_image_url: coverImageUrl,
        };
    
        const updatedFilm = await updateFilm(filmId, updatedFilmData);
    
        return setCORSHeaders(
            NextResponse.json({ status: 'success', message: 'Film updated successfully', data: updatedFilm }),
            'https://labpro-fe.hmif.dev'
        );
        } catch (error) {
        return setCORSHeaders(
            NextResponse.json({ status: 'error', message: 'Failed to update film' }, { status: 500 }),
            'https://labpro-fe.hmif.dev'
        );
        }
  }