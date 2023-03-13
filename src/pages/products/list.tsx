import React from "react";
import {
  IResourceComponentsProps,
  BaseRecord,
  useMany
} from "@pankod/refine-core";
import {
  useTable,
  List,
  Table,
  Space,
  EditButton,
  ShowButton,
  MarkdownField,
  DeleteButton,
  FilterDropdown,
  Select,
  useSelect,
} from "@pankod/refine-antd";

export const ProductList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const { data: categoryData, isLoading: categoryIsLoading } = useMany({
    resource: "categories",
    ids: tableProps?.dataSource?.map((item) => item?.category?.id) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="Id" sorter />
        <Table.Column dataIndex="name" title="Name" sorter={{ multiple: 1 }} />
        <Table.Column dataIndex="material" title="Material" />
        <Table.Column
          dataIndex="description"
          title="Description"
          render={(value: any) => (
            <MarkdownField value={value.slice(0, 80) + "..."} />
          )}
        />
        <Table.Column dataIndex="price" title="Price" />
        <Table.Column
          dataIndex={["category", "id"]}
          title="Category"
          render={(value) =>
            categoryIsLoading ? (
              <>Loading...</>
            ) : (
              categoryData?.data?.find((item) => item.id === value)?.title
            )
          }
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ minWidth: 200 }}
                mode="multiple"
                placeholder="select Category"
                {...categorySelectProps}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
