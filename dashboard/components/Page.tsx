import { cn } from "@/lib/utils";
import styles from "./Page.module.css";
import { ComponentProps } from "react";
import { Skeleton } from "./Skeleton";
import { Text } from "./Text";

export function Page({
  children,
  className,
  breadcrumb,
  header,
}: {
  children: React.ReactNode;
  breadcrumb?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(styles.page, className)}>
      {breadcrumb && <div className={styles.breadcrumbs}>{breadcrumb}</div>}
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export function PageContent({
  children,
  className,
  ...props
}: ComponentProps<"div"> & {
  children: React.ReactNode;
}) {
  return (
    <div className={cn(styles.content, className)} {...props}>
      {children}
    </div>
  );
}

export function PageRoot({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={cn(styles.page, className)} {...props}>
      {children}
    </div>
  );
}

export function PageHeader({ children, ...props }: ComponentProps<"div">) {
  return (
    <div className={styles.header} {...props}>
      {children}
    </div>
  );
}

export function PageBreadcrumb({ children }: { children: React.ReactNode }) {
  return <div className={styles.breadcrumbs}>{children}</div>;
}

export function PageSection({
  header,
  children,
  ...props
}: ComponentProps<"div"> & {
  header?: React.ReactNode;
}) {
  return (
    <div className={styles.section} {...props}>
      {header && <div className={styles.sectionHeader}>{header}</div>}
      {children}
    </div>
  );
}

export function PageSectionTabs({ children }: { children: React.ReactNode }) {
  return <div className={styles.sectionTabs}>{children}</div>;
}

export function PageLoading() {
  return (
    <Page header={<Skeleton />}>
      <Skeleton height={120} />
      <Skeleton height={240} />
    </Page>
  );
}

export function PageError({ children }: { children: React.ReactNode }) {
  return (
    <Page>
      <Text color="error" variant="code">
        {children}
      </Text>
    </Page>
  );
}
