interface AuthorPageProps {
  params: {
    AuthorId: string;
  };
}

const AuthorPage = ({ params }: AuthorPageProps) => {
  const { AuthorId } = params;

  return(
    <div className=" justify-center text-center">
      <h1>{AuthorId}</h1>
    </div>
  )
};

export default AuthorPage;
