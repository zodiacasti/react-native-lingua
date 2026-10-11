// Clerk sends the user back to duolingoclone://sso-callback after Google/Facebook/Apple sign in.
// Clerk reads that URL itself, so there is no screen for it: send the app to "/" instead of
// showing the unmatched route screen. The root layout then shows home or onboarding.
export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    if (path.includes("sso-callback")) {
      return "/";
    }
    return path;
  } catch {
    return "/";
  }
}
