import Router from 'next/router';

export const goPostListPage = (categoryNo: number) => {
  window.scrollTo(0, 0);
  Router.push(`/posts?categoryNo=${categoryNo}`, `/categories/${categoryNo}`);
};

export const goPostEditPage = () => {
  window.scrollTo(0, 0);
  Router.push('/postEdit', '/edit');
};


export const goLoginPage = () => {
  window.scrollTo(0, 0);
  Router.push('/login', '/login');
};
