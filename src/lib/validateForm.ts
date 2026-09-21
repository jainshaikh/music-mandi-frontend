// Client-side-only form validation, ported from music_mandi-website's
// `validateForm()` helper. There is no backend wired up; this only toggles
// `.invalid` on the nearest `.field` wrapper, focuses the first invalid
// control, and scrolls it into view — matching the source's behaviour exactly.
export function validateForm(form: HTMLFormElement): boolean {
  let ok = true;
  const required = form.querySelectorAll<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >("[required]");

  required.forEach((el) => {
    const field = el.closest(".field");
    let valid: boolean | string = el.value?.trim();

    if (el instanceof HTMLInputElement && el.type === "url" && valid) {
      valid = /^https:\/\//i.test(el.value);
    }
    if (el instanceof HTMLSelectElement && el.multiple) {
      valid = el.selectedOptions.length > 0;
    }

    field?.classList.toggle("invalid", !valid);

    if (!valid && ok) {
      ok = false;
      setTimeout(() => el.focus(), 0);
      field?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  return ok;
}
