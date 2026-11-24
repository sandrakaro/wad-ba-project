<script setup>
/**
 * signup_view.vue is the signup page. This is Task 1.2, and Tasks 5 and 6 live
 * here too.
 *
 * It is a view, not a component, because the router shows it for the "/signup"
 * route. The header and the footer are not here, they come from App.vue, so this
 * file only contains the form.
 */
import { reactive } from 'vue'
import { computed } from 'vue'

/**
 * ### The form state ###
 * reactive() instead of two separate refs, because the two fields are one thing:
 * the form. With reactive we write form.email and form.password directly, without
 * .value everywhere, and Vue still tracks both of them.
 *
 * The empty strings are the starting values. v-model in the template keeps these
 * two in sync with what the user types, in both directions.
 */
const form = reactive({
  email: '',
  password: ''
})

/**
 * Runs when the form is submitted.
 *
 * The form uses @submit.prevent, so the browser does NOT do its normal submit and
 * the page does not reload. That is the big difference from Homework 1, where the
 * form had action="index.html". In a single page app a normal submit would throw
 * away all the Vue state, so we stop it and handle everything here.
 *
 * TODO (Tasks 5 and 6): this is where the password validation goes and where the
 * message listing the failed conditions has to be rendered.
 * The console.log below is only a placeholder so we can see the values arrive.
*/
function onSubmit() {
  console.log('signup', form.email, form.password)
}

/**
 * this function validates a password according to rules in hw instructions.
 * for this we have imported computed above and used it here, since we want to
 * compute the list of errors based on the entered password, and we want it to be 
 * recomputed every time the password changes.
 */
const passwordErrors = computed(() => {
  const errors = []
  if (form.password.length < 8) {
    errors.push('Password must be at least 8 characters long.')
  }
  if (form.password.length >= 15) {
    errors.push('Password must be less than 15 characters long.')
    // nb! 15 characters is not allowed
  }
  /**
   * the test function takes the preceding regex and returns true if the string matches it.
   * the / / backslashes are compulsory around regex, they are just a delimiter like " " quotes for strings.
   * here we check if any capital letter from any world alphabet is in the password (ÕÄÖÜ included).
   * \p{Lu} is a unicode category that peans Letter uppercase. \p is the unicode escape character,
   * flag u is compulsory for unicode regex.
   * */

  if (!(/\p{Lu}/u.test(form.password))) {
    errors.push('Password must contain at least one uppercase alphabetic character.')
  }
  /**
   * there is a way to do this with regex but it can be confusing so we use a simpler approach.
   * we go through the whole password, match all lowercase alphabetic characters and put them in an array.
   * if there are none, then lowercaseChars would be null, so we add "or empty array" (|| []) to avoid
   * errors when checking the array's length in case no characters matched.
   * the type of lowercaseChars is array and the type of it's elements is string.
  */
  const lowercaseChars = form.password.match(/\p{Ll}/gu) || []
  if (lowercaseChars.length < 2) {
    errors.push('Password must contain at least two lowercase alphabetic characters.')
  }
  // d stands for digit
  if (!(/\d/.test(form.password))) {
    errors.push('Password must contain at least one numeric value.')
  }
  if (!(/^\p{Lu}/u).test(form.password)) {
    errors.push('Password must start with an uppercase letter.')
  }
  /**
   * here we use regular regex format. it is square brackets [ ], which contain all
   * the characters we are looking for. as always, we add the backslash delimiters around it.
   */
  if (!(/[_]/.test(form.password))) {
    errors.push('Password must contain an underscore _ character.')
  }

  return errors
})
</script>

<template>
  <!-- The same card as Figure 2: a pale green box with two rows and a blue
       button. All of that styling is in main.css, nothing is inline here. -->
  <main class="signup-page">
    <form class="signup-card" @submit.prevent="onSubmit">
      <div class="form-row">
        <!-- The for attribute matches the id of the input, so clicking the label
             puts the cursor in the field. That also helps screen readers. -->
        <label for="signup-email">Email</label>
        <!-- v-model is two way binding. It is shorthand for setting :value from
             form.email and updating form.email on every input event, so we never
             write an event handler for typing.

             type="email" and required are the browser's own checks. They are
             useful but they are not the validation Task 6 asks for, because they
             only look at the email field and say nothing about the password. -->
        <input
          id="signup-email"
          v-model="form.email"
          type="email"
          placeholder="Email"
          required
        />
      </div>

      <div class="form-row">
        <label for="signup-password">Password</label>
        <input
          id="signup-password"
          v-model="form.password"
          type="password"
          placeholder="Password"
          required
        />
      </div>

      <!-- TASK 6: the validation message <p> goes right here, inside the
           form, above the button. The .password-error class is already styled in
           main.css, so it only needs the markup and the computed that produces the
           list of failed conditions. The homework wants every failed condition
           listed, not just "invalid". -->
      <p class="password-error" v-if="form.password && passwordErrors.length">
        {{'The password is not valid –\n' + '* ' + passwordErrors.join('\n * ') }}
      </p>
      <!--button is diabled if at least one error is present in the password-->
      <button type="submit" class="signup-btn" :disabled="passwordErrors.length>0">Signup</button>
    </form>
  </main>
</template>
