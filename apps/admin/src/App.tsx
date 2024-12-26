import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout";
import NotFound from "./pages/NotFound";
import PrivateRoutes from "./routes/PrivateRoutes";
import Users from "./pages/Users";
import PermissionProtectedRoute from "./routes/PermissionProtectedRoute";
import ReactRouterErrorPage from "./pages/ReactRouterErrorPage";
import Login from "./pages/Login";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { trpc, trpcClient } from "./lib/trpc";

const router = createBrowserRouter([
    {
        path: "/",
        element: <PrivateRoutes />,
        errorElement: <ReactRouterErrorPage />,
        children: [
            {
                path: "/",
                element: <Layout />,
                children: [
                    {
                        path: "/",
                        element: <PermissionProtectedRoute requiredPermissions={{ users: { read: true } }} />,
                        children: [
                            {
                                path: "/users",
                                element: <Users />,
                            },
                        ],
                    },
                    {
                        path: "/users",
                        element: <PermissionProtectedRoute requiredPermissions={{ users: { read: true } }} />,
                        children: [
                            {
                                path: "/users",
                                element: <Users />,
                            },
                        ],
                    },
                    {
                        path: "*",
                        element: <NotFound />,
                    },
                ],
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

const App = () => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        staleTime: 1000 * 15, // 15 seconds - cache time
                        // refetchOnMount: false,
                        retry: (failureCount, error) => {
                            if (error && [
                                'BAD_REQUEST',  //400
                                'UNAUTHORIZED', //401
                                'FORBIDDEN',    //403
                                'NOT_FOUND'     //404
                              ].some(statusCode => error.message.includes(statusCode)))
                                return false;
                            else if (failureCount < 5) return true;
                            else return false;
                        },
                    },
                },
            })
    );
    const [_trpcClient] = useState(() => trpcClient);
    return (
        <trpc.Provider client={_trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </trpc.Provider>
    );
};

export default App;
