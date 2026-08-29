import { notFound } from 'next/navigation';
import AppPlaceholder from '../../components/app-placeholder/AppPlaceholder';
import { findApp } from '../../components/layout/app-shell/apps';

export default async function AppPage(props: { params: Promise<{ appKey: string }> }) {
  const params = await props.params;
  const app = findApp(params.appKey);

  if (!app) {
    notFound();
  }

  return <AppPlaceholder title={app.name} description='준비 중인 앱입니다' />;
}
