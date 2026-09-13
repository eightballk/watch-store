import * as React from "react";
import { BaseFormFieldProps } from "../../../../types/form";
import Loader from "../../Loader/Loader";
import { getAllProductCategories } from "../../../../services/api/category/categoryAPI";
import { CategoryDTO } from "../../../../types/productType";
import { Link } from "react-router-dom";

interface SelectFieldProps extends BaseFormFieldProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id"> {

}

export default function SelectField({ id, error, ...attributes }: SelectFieldProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null | unknown>(null);
  const [options, setOptions] = React.useState<CategoryDTO[]>([]);

  async function fetchCategoryOptions() {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await getAllProductCategories();
      setOptions(data);
    } catch (error) {
      setFetchError(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    fetchCategoryOptions();
  }, []);

  if (isLoading) return <Loader className="text-white border-white mx-auto" />

  if (fetchError) return <span className="text-white">Could not get category options. Try again later.</span>

  if (options.length === 0) return <Link to={"/profile/product-category"} className="text-white underline underline-offset-4 tracking-wide">No categories yet. Click here to create one.</Link>

  return (
    <select
      id={id}
      className={`formElementDefaultStyling ${error ? "formElementErrorStyling" : null}`}
      {...attributes}
    >
      <option value="" disabled hidden>
        Select a category
      </option>

      {options.map((option) => (
        <option value={option.categoryName} key={option.id}>
          {option.categoryName}
        </option>
      ))}
    </select>
  )
}
