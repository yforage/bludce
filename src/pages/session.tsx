import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import QueriedElement from "@/context/QueryContext";
import supabase from "@/utils/supabase";
import Layout from "@/components/layout/Layout";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { IUserContext } from "@/context/useAppContext";
import { client } from "@/api/graphql";
import { useWindowDimensions } from "@/utils";

const SessionProvider = () => {
  const [user, setUser] = useState<IUserContext["user"]>(null);

  const { isMobile } = useWindowDimensions();

  useEffect(() => {
    const auth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session?.user) {
        const anonUser = await supabase.auth.signInAnonymously();
        client.setHeader(
          "Authorization",
          `Bearer ${anonUser.data.session?.access_token}`,
        );
        setUser(anonUser.data.user);
      } else {
        client.setHeader(
          "Authorization",
          `Bearer ${data.session.access_token}`,
        );
        setUser(data.session.user);
      }
    };
    auth();

    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        client.setHeader("Authorization", "");
        setUser(null);
      } else if (session) {
        client.setHeader("Authorization", `Bearer ${session.access_token}`);
        setUser(session.user);
      }
    });

    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, []);

  return (
    <QueriedElement>
      <Layout>
        <Header loggedUser={user} isMobile={isMobile} />
        <Outlet context={{ user, isMobile } satisfies IUserContext} />
        <Footer />
      </Layout>
    </QueriedElement>
  );
};

export default SessionProvider;
