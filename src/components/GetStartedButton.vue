<template>
  <UIDialog>
    <UIDialogTrigger as-child>
      <UIButton class="bg-emerald-500">Get Started</UIButton>
    </UIDialogTrigger>
    <UIDialogContent class="sm:max-w-[425px]">
      <UIDialogHeader>
        <UIDialogTitle class="text-2xl">Sign In</UIDialogTitle>
        <UIDialogDescription>
          Sign in to your account to get started
        </UIDialogDescription>
      </UIDialogHeader>

      <UIButton @click="signInWithGithub">Sign in with GitHub</UIButton>
    </UIDialogContent>
  </UIDialog>
</template>

<script lang="ts" setup>
function signInWithGithub() {
  window.location.href = '/auth/login/github'
}
</script>
