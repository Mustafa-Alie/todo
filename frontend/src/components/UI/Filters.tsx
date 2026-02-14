export default function Filters() {
  return (
    <div className="hidden gap-2 md:flex">
      <input type="radio" name="filter" className="hidden" id="all" />
      <label htmlFor="all" className="cursor-pointer p-1 text-blue-600">
        All
      </label>

      <input type="radio" name="filter" className="hidden" id="active" />
      <label htmlFor="active" className="cursor-pointer p-1">
        Active
      </label>

      <input type="radio" name="filter" className="hidden" id="completed" />
      <label htmlFor="completed" className="cursor-pointer p-1">
        Completed
      </label>
    </div>
  );
}
