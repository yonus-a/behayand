import type { ObjectDirective } from 'vue'

const imagePickerDirective: ObjectDirective = {
  mounted(el, binding) {
    const input = document.createElement('input')
    input.type = 'file'
    // Updated: Accept only image files (jpg, png, webp, etc.)
    input.accept = 'image/*'
    input.style.display = 'none'

    el.appendChild(input)

    el.addEventListener('click', () => {
      input.click()
    })

    input.addEventListener('change', (event) => {
      const inputElement = event.target as HTMLInputElement;
      const file = inputElement.files?.[0];
      if (file) {
        const path = URL.createObjectURL(file);
        // Ensure the binding is a function before calling
        if (typeof binding.value === 'function') {
          binding.value(path, file);
        }
      }
      // Reset so selecting the same image again works
      inputElement.value = '';
    });

    el.style.cursor = 'pointer'
    el.title = 'Click to select an image'
  }
}

export default imagePickerDirective