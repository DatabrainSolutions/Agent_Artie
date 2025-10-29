import App from "./App";

// Force dynamic rendering to avoid static generation issues with ChatKit
export const dynamic = "force-dynamic";

export default function Home() {
  return <App />;
}
