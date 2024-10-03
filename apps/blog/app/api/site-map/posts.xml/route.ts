import { makePostsSiteMap } from '../../../../utils/blog/siteMapGenerator';

export async function GET() {
  const xml = await makePostsSiteMap();

  const response = new Response(xml, {
    status: 200,
    statusText: 'ok',
  });

  response.headers.append('content-type', 'text/xml');

  return response;
}
