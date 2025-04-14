const SubHeading = ({ subtitle, className }) => {
  return (
    <p className={`${className} text-gray-600 dark:text-gray-300 mt-2 text-sm`}>
      {subtitle}
    </p>
  );
};

export default SubHeading;