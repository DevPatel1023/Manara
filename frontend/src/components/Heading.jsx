const Heading = ({ style, title }) => {
  return (
    <div>
      <h1 className={`${style} text-[#1e2022] dark:text-white`}>
        {title}
      </h1>
    </div>
  );
};
 export default Heading;