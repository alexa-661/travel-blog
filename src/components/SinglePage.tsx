
const SinglePage = (Props: {title: string, children: React.ReactNode}) => {
    const { title, children } = Props;
    return (
      <div style={{margin: '1rem'}}>
         <h2 style={{ display: 'block', textAlign: 'left' }}>{title}</h2>
         {children}
      </div>
   )
};

export default SinglePage;